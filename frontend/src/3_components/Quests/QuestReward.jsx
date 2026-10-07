import { useRef, useEffect, useState } from "react"
import { Animated, Text, View, Button } from "react-native"
import { rewardStyles } from "../../2_services/styles"
import { useQuests } from "../../2_services/context"
import { useNavigation } from "@react-navigation/native"

import HeaderTitle from "../../3_components/Utils/headerTitle.jsx"
import SmallLineDiamond from "../../3_components/Utils/SmallLineDiamond.jsx"


function QuestReward({ onClose }) {
  const { reward } = useQuests()

  const navigation = useNavigation()

  const widthAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;

  const rewardOpacity = useRef(new Animated.Value(0)).current;
  const rewardTranslateY = useRef(new Animated.Value(0)).current;

  const overlayOpacity = useRef(new Animated.Value(1)).current;

  const [currentRewardIndex, setCurrentRewardIndex] = useState(0);

  const rewardEntries = Object.entries(
    reward?.reward?.reward ?? {}
  );

  const openReward = () => {

    Animated.sequence([

      // Horizontal line grows from the center
      Animated.timing(widthAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),

      // Panel grows vertically from the center
      Animated.timing(heightAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),

      // Small pause before reward appears
      Animated.delay(150),

    ]).start(() => {
      playReward(0);
    });

  };

  const playReward = (index) => {
    if (index >= rewardEntries.length) {
      // Once the list is empty the whole reward fades away
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onClose();
      });

      return;
    }

    setCurrentRewardIndex(index);
  };

  useEffect(() => {
    if (currentRewardIndex >= rewardEntries.length) {
      return;
    }

    // Reset before showing the new reward
    rewardOpacity.setValue(1);
    rewardTranslateY.setValue(80);

    Animated.sequence([

      // Reward comes up into the middle
      Animated.timing(rewardTranslateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),

      // Keep it visible
      Animated.delay(2000),

      // Reward goes up and fades out
      Animated.parallel([
        Animated.timing(rewardTranslateY, {
          toValue: -80,
          duration: 500,
          useNativeDriver: true,
        }),

        Animated.timing(rewardOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),

    ]).start(({ finished }) => {
      if (finished) {
        playReward(currentRewardIndex + 1);
      }
    });
  }, [currentRewardIndex, rewardEntries.length]);

  useEffect(() => {
    openReward();
  }, []);


  // animate the styles of this (don't use ai much!!)
  // get the length and items in the reward and have it go one by one displaying it for only a few seconds and then making it go up and fade out
  // onces the list is emtpy the whole reward fades away
  // (does not fade in it comes in the solo leveling themed way)
  // don't remove comments till it's all done

  return (
    <Animated.View
      style={[
        rewardStyles.overlay,
        {
          opacity: overlayOpacity,
        },
      ]}
    >

      <Animated.View
        style={[
          rewardStyles.fadingBox,
          {
            transform: [
              {
                scaleX: widthAnim,
              },
            ],
          },
        ]}
      >
        <View style={{ margin: 20, marginTop: 45 }}>
          <HeaderTitle title="REWARD ACQUIRED" subHeader="YOUR EFFORTS PAY OFF" color="#38E6A3" />
        </View>
        <Animated.View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            transform: [
              {
                scaleY: heightAnim,
              },
            ],
          }}
        >

          <Animated.View
            style={{
              opacity: rewardOpacity,
              transform: [
                {
                  translateY: rewardTranslateY,
                },
              ],
            }}
          >


            {rewardEntries.length > 0 && (
              <Text style={rewardStyles.text}>
                {rewardEntries[currentRewardIndex][0] === "exp"
                  ? `+${String(rewardEntries[currentRewardIndex][1])} XP`
                  : `+${String(rewardEntries[currentRewardIndex][1])} ${String(
                    rewardEntries[currentRewardIndex][0]
                  )}`}
              </Text>
            )}
          </Animated.View>
        </Animated.View>
        <SmallLineDiamond color="#38E6A3" />
      </Animated.View>
    </Animated.View>
  )
}

export default QuestReward
