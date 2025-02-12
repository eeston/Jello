import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  NativeModules,
  ScrollView,
  StyleSheet,
  Text,
  View,
  findNodeHandle,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const { UIManager } = NativeModules;

const SCROLL_DELAY = 2000;
const SCROLL_GAP = 50;
const SCROLL_SPEED = 40;

type TitleScrollProps = {
  text: string;
  type: "subtitle" | "title";
};

// TODO: don't think I will use this anywhere else but maybe work
// on making it a little more reuseable
export const TitleScroll = ({ text, type }: TitleScrollProps) => {
  const [contentFits, setContentFits] = useState(true);
  const [textWidth, setTextWidth] = useState(0);
  // eslint-disable-next-line react-compiler/react-compiler
  const animatedValue = useRef(new Animated.Value(0)).current;
  const animation = useRef<Animated.CompositeAnimation | null>(null);
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const { styles } = useStyles(stylesheet);

  const textStyle = type === "title" ? styles.textTitle : styles.textSubtitle;

  useEffect(() => {
    animatedValue.stopAnimation();
    animatedValue.setValue(0);
    calculateTextSize().then((contentFits) => {
      if (!contentFits) {
        startAnimation();
      }
    });
  }, [text, textWidth, contentFits]);

  useEffect(() => {
    return () => {
      if (timeoutId.current) clearTimeout(timeoutId.current);
      if (animation.current) animation.current.stop();
    };
  }, []);

  const startAnimation = () => {
    timeoutId.current = setTimeout(() => {
      if (!contentFits) {
        scroll();
      }
    }, SCROLL_DELAY);
  };

  const scroll = () => {
    if (animation.current) {
      animation.current.stop();
    }

    const scrollToValue = -textWidth - SCROLL_GAP;
    animation.current = Animated.timing(animatedValue, {
      duration: Math.abs(scrollToValue) * SCROLL_SPEED,
      easing: Easing.linear,
      toValue: scrollToValue,
      useNativeDriver: true,
    });
    animation.current.start(({ finished }) => {
      if (finished) {
        setTimeout(() => {
          animatedValue.setValue(0);
          scroll();
        }, SCROLL_DELAY);
      }
    });
  };

  const measure = async (
    ref: React.RefObject<any>,
  ): Promise<{ width: number }> => {
    return new Promise((resolve, reject) => {
      if (ref.current) {
        UIManager.measure(
          findNodeHandle(ref.current),
          (x: number, y: number, width: number) => {
            resolve({ width });
          },
        );
      } else {
        reject();
      }
    });
  };

  const calculateTextSize = async () => {
    try {
      const [{ width: containerWidth }, { width: textWidth }] =
        await Promise.all([measure(containerRef), measure(textRef)]);
      const contentFits = textWidth - containerWidth <= 1;
      setTextWidth(textWidth);
      setContentFits(contentFits);
      return contentFits;
    } catch (_err) {
      // default to fits
      return true;
    }
  };

  return (
    <View style={styles.container}>
      <Text
        numberOfLines={1}
        style={[textStyle, { opacity: contentFits ? 1 : 0 }]}
      >
        {text}
      </Text>
      <ScrollView
        horizontal
        onContentSizeChange={calculateTextSize}
        ref={containerRef}
        scrollEnabled={!contentFits}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        style={StyleSheet.absoluteFillObject}
      >
        {/* text that gets scrolled */}
        <Animated.Text
          numberOfLines={1}
          ref={textRef}
          style={[
            textStyle,
            {
              opacity: !contentFits ? 1 : 0,
              transform: [{ translateX: animatedValue }],
              width: null,
            },
          ]}
        >
          {text}
        </Animated.Text>

        {/* second bit of text scrolls but is used to create seamless loop */}
        {!contentFits && (
          <View style={{ paddingLeft: SCROLL_GAP }}>
            <Animated.Text
              numberOfLines={1}
              style={[
                textStyle,
                {
                  opacity: !contentFits ? 1 : 0,
                  transform: [{ translateX: animatedValue }],
                  width: null,
                },
              ]}
            >
              {text}
            </Animated.Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    overflow: "hidden",
  },
  fadeLeft: {
    height: "100%",
    left: 0,
    position: "absolute",
    width: 50,
  },
  fadeRight: {
    height: "100%",
    position: "absolute",
    right: 0,
    width: 50,
  },
  textSubtitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 20,
  },
  textTitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 20,
    fontWeight: "bold",
  },
}));
