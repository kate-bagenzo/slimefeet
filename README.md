# slime feet build
## how to use
1. fork this repository
2. install node (https://nodejs.org/en)
3. enter folder and type `npm run install`
4. you can now see a preview of the game with `npm run dev`

## how to make builds
push any change to git on the main branch
(if you have nothing to change and just want to force a new build, increase the version number in `package.json` )
github actions will then create builds for windows/mac/linux under the "releases" section

### todo
- click/space to end automode
- click anywhere to proceed
- close buttons for settings/history
- second splash screen