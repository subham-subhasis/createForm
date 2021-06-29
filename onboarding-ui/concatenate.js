const fs = require('fs-extra');
const concat = require('concat');
(async function build() {
    const files = [
        './dist/SelfOnboardingPM/runtime-es2015.js',
        './dist/SelfOnboardingPM/polyfills-es2015.js',
        './dist/SelfOnboardingPM/scripts.js',
        './dist/SelfOnboardingPM/main-es2015.js',
    ];
    const filesEs5 = [
        './dist/SelfOnboardingPM/runtime-es5.js',
        './dist/SelfOnboardingPM/polyfills-es5.js',
        './dist/SelfOnboardingPM/scripts.js',
        './dist/SelfOnboardingPM/main-es5.js',
    ];
    await fs.ensureDir('elements')
    await concat(files, 'elements/custom-element-es2015.js');
    await concat(filesEs5, 'elements/custom-element-es5.js');
    await fs.copyFile('./dist/SelfOnboardingPM/styles.css', 'elements/elementstyles.css');
    await fs.copy('./dist/SelfOnboardingPM/assets/', 'elements/assets/');
})();

