const fs = require('fs');
const path = require('path');

const gradlePath = path.join(process.cwd(), 'android', 'app', 'build.gradle');
let gradle = fs.readFileSync(gradlePath, 'utf8');

gradle = gradle.replace(/applicationId\s+["'][^"']+["']/g, 'applicationId "com.lafabricapp.lafabricapp20"');
gradle = gradle.replace(/versionCode\s+\d+/g, 'versionCode 1');
gradle = gradle.replace(/versionName\s+["'][^"']+["']/g, 'versionName "1.0.0"');

if (false) {
  const signingBlock = [
    '    signingConfigs {',
    '        release {',
    '            def ksFile = file("release-key.keystore")',
    '            if (ksFile.exists()) {',
    '                storeFile ksFile',
    '            }',
    '            def sPass = System.getenv("STORE_PASS")',
    '            def kPass = System.getenv("KEY_PASS")',
    '            def kAlias = System.getenv("KEY_ALIAS")',
    '            def sType = System.getenv("STORE_TYPE")',
    '            if (sPass) storePassword sPass',
    '            if (kPass) keyPassword kPass',
    '            if (kAlias) keyAlias kAlias',
    '            if (sType) storeType sType',
    '        }',
    '    }',
    ''
  ].join('\n');

  if (!gradle.includes('signingConfigs {') && gradle.includes('buildTypes {')) {
    gradle = gradle.replace('buildTypes {', signingBlock + '    buildTypes {');
  }

  const btIdx = gradle.indexOf('buildTypes {');
  if (btIdx !== -1) {
    const relIdx = gradle.indexOf('release {', btIdx);
    if (relIdx !== -1) {
      const openBrace = gradle.indexOf('{', relIdx);
      let depth = 0;
      let endBrace = -1;
      for (let i = openBrace; i < gradle.length; i++) {
        if (gradle[i] === '{') depth++;
        else if (gradle[i] === '}') {
          depth--;
          if (depth === 0) {
            endBrace = i;
            break;
          }
        }
      }
      if (endBrace !== -1) {
        const newRelease = [
          'release {',
          '            signingConfig signingConfigs.release',
          '            minifyEnabled false',
          '            shrinkResources false',
          '        }'
        ].join('\n');
        gradle = gradle.slice(0, releaseIdx) + newRelease + gradle.slice(endBrace + 1);
      }
    }
  }
}

fs.writeFileSync(gradlePath, gradle, 'utf8');
console.log('Configurado build.gradle -> packageId=com.lafabricapp.lafabricapp20, versionCode=1, versionName=1.0.0');
