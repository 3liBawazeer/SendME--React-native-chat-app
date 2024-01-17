module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    production: {
      plugins: ["transform-remove-console"],     //removing consoles.log from app during release (production) versions
    },
  },
  // plugins: [
  //   'react-native-reanimated/plugin',
  // ],
};
