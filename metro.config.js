// metro-config's mergeConfig calls Array.prototype.toReversed (Node 20+);
// keep `expo start` working on Node 18.
if (!Array.prototype.toReversed) {
  Object.defineProperty(Array.prototype, 'toReversed', {
    value: function () {
      return [...this].reverse()
    },
    writable: true,
    configurable: true,
  })
}

const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

// react-native-maps is native-only and breaks web bundling; resolve it to an
// empty module on web (the map route has a .web.tsx stub, so it never renders).
const defaultResolveRequest = config.resolver.resolveRequest
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && (moduleName === 'react-native-maps' || moduleName.startsWith('react-native-maps/'))) {
    return { type: 'empty' }
  }
  if (defaultResolveRequest) return defaultResolveRequest(context, moduleName, platform)
  return context.resolveRequest(context, moduleName, platform)
}

module.exports = config
