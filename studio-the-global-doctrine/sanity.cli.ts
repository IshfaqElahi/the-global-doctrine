import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'vk54bhae',
    dataset: 'production'
  },
  deployment: {
    autoUpdates: true,
    appId: 'tgqpimkuhd5h4i0hh169ptl4',
  }
})