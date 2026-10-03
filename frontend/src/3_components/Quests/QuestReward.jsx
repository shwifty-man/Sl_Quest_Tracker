import { useRef, useEffect, useState } from "react"
import { Animated, Text, View, Button } from "react-native"
import { rewardStyles } from "../../2_services/styles"
import { useQuests } from "../../2_services/context"
import { useNavigation } from "@react-navigation/native"


import BackArrow from "../../3_components/Utils/BackArrow.jsx"


function QuestReward() {
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
        navigation.goBack();
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
    rewardOpacity.setValue(0);
    rewardTranslateY.setValue(0);

    Animated.sequence([
      // Reward appears
      Animated.timing(rewardOpacity, {
        toValue: 1,
        duration: 250,
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
      <BackArrow navigation={navigation} />
      <Text style={rewardStyles.title}>Reward: {reward?.reward?.reward.exp} XP</Text>
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
        <Animated.View
          style={{
            flex: 1,
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
          >  <Text style={rewardStyles.rewardLabel}>
              REWARD ACQUIRED
            </Text>
            {rewardEntries.length > 0 && (
              <Text style={rewardStyles.text}>
                {rewardEntries[currentRewardIndex][0] === "exp"
                  ? `+${rewardEntries[currentRewardIndex][1]} XP`
                  : `+${rewardEntries[currentRewardIndex][1]} ${rewardEntries[currentRewardIndex][0]
                  }`}
              </Text>
            )}
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  )
}

export default QuestReward
