// pages/ExtensionsPage.tsx
import { Checkbox, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { usePluginContext } from "../plugin-system/PluginContext";
import { plugins } from "../plugin-system/PluginRegister";



const ExtensionsPage = () => {
  const { enabledPlugins, togglePlugin } = usePluginContext();

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Manage Extensions
      </Typography>
      <List>
        {plugins.map((plugin) => (
          <ListItemButton key={plugin.name} onClick={() => togglePlugin(plugin.name as any)}>
            <ListItemIcon>
              <Checkbox checked={enabledPlugins.includes(plugin.name as any)} />
            </ListItemIcon>
            <ListItemText
              primary={plugin.name}
              secondary={plugin.description}
            />
          </ListItemButton>
        ))}
      </List>
    </div>
  );
};

export default ExtensionsPage;
