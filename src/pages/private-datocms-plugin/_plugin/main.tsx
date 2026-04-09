/*
 * Entry point for a DatoCMS plugin. The connect() call registers every hook the
 * plugin implements. Each render hook receives a context object (ctx) that
 * provides access to plugin parameters, the current user/role, and helpers.
 *
 * This example implements a renderConfigScreen hook, which adds a settings page
 * under Settings > Plugins > [your plugin]. You can extend this file by adding
 * more hooks to the connect() call — for example renderFieldExtension,
 * renderItemFormSidebarPanel, onBeforeItemUpsert, and many others.
 *
 * For an overview of all available hooks:
 * https://www.datocms.com/docs/plugin-sdk/what-hooks-are
 */

import { connect } from 'datocms-plugin-sdk';
import ConfigScreen from './entrypoints/ConfigScreen';
import { render } from './utils/render';
import 'datocms-react-ui/styles.css';

connect({
  renderConfigScreen(ctx) {
    render(<ConfigScreen ctx={ctx} />);
  },
});

/*
 * This default export exists solely so Astro can import this file as a
 * component. The actual plugin UI is rendered imperatively by connect() above,
 * which takes over the #root element as soon as the script loads.
 */
export default function PluginEntry() {
  return null;
}
