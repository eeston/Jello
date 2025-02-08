import { ThemedText } from "@src/components/ThemedText";
import { SymbolView } from "expo-symbols";
import { Alert, Pressable, View } from "react-native";
import { TrackMetadataBase } from "react-native-track-player";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export const NowPlayingTitle = ({
  artist,
  title,
}: {
  artist: TrackMetadataBase["artist"];
  title: TrackMetadataBase["title"];
}) => {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <ThemedText
          numberOfLines={1}
          style={{ color: "white" }}
          type="subtitle"
        >
          {title ?? "Unknown Track"}
        </ThemedText>
        <ThemedText
          style={{ color: "rgba(255, 255, 255, 0.4)" }}
          type="defaultSemiBold"
        >
          {artist ?? "Unknown Artist"}
        </ThemedText>
      </View>
      <View style={styles.buttonsContainer}>
        <Pressable
          onPress={() => Alert.alert("TODO...")}
          style={{
            backgroundColor: theme.colors.translucent,
            borderRadius: theme.spacing.md,
            marginHorizontal: theme.spacing.xxs,
            padding: theme.spacing.xxs,
          }}
        >
          <SymbolView
            name="star"
            resizeMode="scaleAspectFit"
            size={theme.symbol.sm}
            tintColor="white"
            weight="medium"
          />
        </Pressable>

        <Pressable
          onPress={() => Alert.alert("TODO...")}
          style={{
            backgroundColor: theme.colors.translucent,
            borderRadius: theme.spacing.md,
            marginHorizontal: theme.spacing.xxs,
            padding: theme.spacing.xxs,
          }}
        >
          <SymbolView
            name="ellipsis"
            resizeMode="scaleAspectFit"
            size={theme.symbol.sm}
            tintColor="white"
            weight="medium"
          />
        </Pressable>
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet((theme, runtime) => ({
  buttonsContainer: {
    alignItems: "center",
    flexDirection: "row",
    flexShrink: 0, // Prevents buttons from shrinking
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.xl,
    width: "100%",
  },
  textContainer: {
    flex: 1,
    flexShrink: 1, // Allows text to shrink
    marginRight: theme.spacing.md, // Adds space between text and buttons
  },
}));
