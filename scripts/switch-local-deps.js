const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PACKAGE_JSON_PATH = path.join(ROOT, 'package.json');
const CONFIG = require('./switch-local-deps.config.js');

const MODES = ['local', 'packaged'];
const USAGE = `Usage: node scripts/switch-local-deps.js <${MODES.join('|')}|status> [--no-install] [--no-build]

Switch @splitmedialabs/xjs between a local portal link and the packaged npm version.

Examples:
  yarn deps:local
  yarn deps:packaged
  yarn deps:status
  node scripts/switch-local-deps.js local --no-install
`;

function readPackageJson() {
  return JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
}

function readPackageJsonRaw() {
  return fs.readFileSync(PACKAGE_JSON_PATH, 'utf8');
}

function writePackageJson(pkg) {
  fs.writeFileSync(PACKAGE_JSON_PATH, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
}

function isLocalSpec(value) {
  return typeof value === 'string' && value.startsWith('portal:');
}

function getDepValue(pkg, dep) {
  const section = pkg[dep.section] || {};
  return section[dep.name];
}

function setDepValue(pkg, dep, value) {
  if (!pkg[dep.section]) {
    pkg[dep.section] = {};
  }
  pkg[dep.section][dep.name] = value;
}

function detectMode(pkg) {
  const values = CONFIG.deps.map(dep => getDepValue(pkg, dep));
  if (values.every(isLocalSpec)) {
    return 'local';
  }
  if (values.every(value => !isLocalSpec(value))) {
    return 'packaged';
  }
  return 'mixed';
}

function resolveSiblingPath(relativePath) {
  return path.resolve(ROOT, relativePath);
}

function pathExists(relativePath) {
  return fs.existsSync(resolveSiblingPath(relativePath));
}

function runCommand(command, cwd, label, envExtra) {
  console.log(`\n→ ${label}`);
  console.log(`  ${command} (cwd: ${path.relative(process.cwd(), cwd) || '.'})`);

  const result = spawnSync(command, {
    cwd,
    stdio: 'inherit',
    shell: true,
    env: Object.assign({}, process.env, envExtra),
  });

  if (result.status !== 0) {
    throw new Error(`Command failed (${result.status}): ${command}`);
  }
}

function runYarnInstall(cwd, label) {
  runCommand('yarn install --mode=skip-build', cwd, label, {
    YARN_ENABLE_SCRIPTS: '0',
  });
}

function printStatus(pkg) {
  const mode = detectMode(pkg);

  console.log(`Dependency mode: ${mode}\n`);

  CONFIG.deps.forEach(dep => {
    const value = getDepValue(pkg, dep);
    const kind = isLocalSpec(value) ? 'local' : 'packaged';
    console.log(`  ${dep.name}`);
    console.log(`    mode:  ${kind}`);
    console.log(`    spec:  ${value}`);
    if (dep.siblingPath) {
      const exists = pathExists(dep.siblingPath);
      console.log(`    path:  ${dep.siblingPath} (${exists ? 'found' : 'missing'})`);
    }
  });

  if (mode === 'mixed') {
    console.log('\nWarning: dependencies are split between local and packaged specs.');
    console.log('Run `yarn deps:local` or `yarn deps:packaged` to normalize.');
  }

  if (mode === 'local') {
    console.log('\nNote: use `yarn start` with --preserve-symlinks when consuming portal deps.');
  }
}

function applyMode(mode, options) {
  const previousPkg = readPackageJsonRaw();
  const pkg = JSON.parse(previousPkg);
  const currentMode = detectMode(pkg);
  const targetValue = dep => (mode === 'local' ? dep.local : dep.packaged);

  if (currentMode === mode) {
    console.log(`Already using ${mode} dependencies.`);
    printStatus(pkg);
    return;
  }

  if (mode === 'local') {
    const missing = CONFIG.deps.filter(
      dep => dep.siblingPath && !pathExists(dep.siblingPath)
    );

    if (missing.length > 0) {
      const labels = missing.map(dep => `${dep.siblingLabel} (${dep.siblingPath})`).join(', ');
      throw new Error(`Missing sibling folders for local mode: ${labels}`);
    }
  }

  CONFIG.deps.forEach(dep => {
    setDepValue(pkg, dep, targetValue(dep));
  });

  writePackageJson(pkg);
  console.log(`Updated package.json to ${mode} dependencies.`);

  try {
    if (!options.noInstall) {
      runYarnInstall(ROOT, 'Install dependencies with Yarn');
    }

    if (mode === 'local' && !options.noBuild) {
      CONFIG.deps.forEach(dep => {
        if (dep.postLocal) {
          runCommand(
            dep.postLocal.command,
            resolveSiblingPath(dep.postLocal.cwd),
            dep.postLocal.label
          );
        }
      });
    }

    printStatus(readPackageJson());
  } catch (error) {
    fs.writeFileSync(PACKAGE_JSON_PATH, previousPkg, 'utf8');
    throw new Error(`${error.message}\nRestored previous package.json.`);
  }
}

function parseArgs(argv) {
  const positional = argv.filter(arg => !arg.startsWith('--'));
  const mode = positional[0];

  return {
    mode,
    noInstall: argv.includes('--no-install'),
    noBuild: argv.includes('--no-build'),
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const { mode, noInstall, noBuild } = options;

  if (!mode || mode === '--help' || mode === '-h') {
    console.log(USAGE.trim());
    process.exit(mode ? 0 : 1);
  }

  if (mode === 'status') {
    printStatus(readPackageJson());
    return;
  }

  if (!MODES.includes(mode)) {
    console.error(`Unknown mode: ${mode}\n`);
    console.log(USAGE.trim());
    process.exit(1);
  }

  applyMode(mode, { noInstall, noBuild });
}

try {
  main();
} catch (error) {
  console.error(`\nError: ${error.message}`);
  process.exit(1);
}
