import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

/**
 * @description some list views dont scroll to the bottom so...
 */
export const ListPadding = () => {
  const { styles } = useStyles(stylesheet);
  return <View style={styles.container} />;
};

const stylesheet = createStyleSheet((theme, runtime) => ({
  container: {
    paddingVertical: runtime.screen.height / 4,
  },
}));
