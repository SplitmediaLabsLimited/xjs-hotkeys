/**
 * Local vs packaged dependency specs for xjs-hotkeys.
 * Edit packaged versions here when bumping registry pins.
 */
module.exports = {
  deps: [
    {
      name: '@splitmedialabs/xjs',
      section: 'devDependencies',
      local: 'portal:../xjs',
      packaged: '^2.14.0',
      siblingPath: '../xjs',
      siblingLabel: 'xjs',
      postLocal: {
        cwd: '../xjs',
        command: 'npm run build',
        label: 'Build local xjs (includes xjs-es2015.min.js for the demo app)',
      },
    },
  ],
};
