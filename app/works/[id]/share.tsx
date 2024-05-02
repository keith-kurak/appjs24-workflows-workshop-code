import { useState } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  Pressable,
  Platform,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { useWorkByIdQuery } from "@/data/hooks/useWorkByIdQuery";
import { LoadingShade } from "@/components/LoadingShade";
import * as Sharing from "expo-sharing";
import ImagePicker, {
  Image as ImageType,
} from "react-native-image-crop-picker";

export default function ShareWork() {
  const dimensions = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: work, isLoading } = useWorkByIdQuery(id!);
  const [croppedImage, setCroppedImage] = useState<ImageType | null>(null);

  async function share() {
    await Sharing.shareAsync(croppedImage?.path!);
  }

  async function crop() {
    const image = await ImagePicker.openCropper({
      path: work.images.web.url,
      width: 300,
      height: 300,
      mediaType: "photo",
    });
    setCroppedImage(image);
  }

  return (
    <View className="flex-1 bg-shade-1">
      <Stack.Screen
        options={{
          title: "Share",
        }}
      />
      <View className="py-4 px-4 bg-shade-2 gap-4">
        <Text className="text-2xl text-center">
          Share a clip of this work with your friends.
        </Text>
        <View
          style={{
            height: dimensions.width - 50,
            width: dimensions.width - 50,
            alignSelf: "center",
          }}
        >
          <Image
            source={{
              uri: croppedImage
                ? croppedImage.path
                : work && work.images.web.url,
            }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            transition={500}
          />
        </View>
        <RoundButton onPress={crop} title="Crop" />
        <RoundButton title="Share" onPress={share} disabled={!croppedImage} />
      </View>
      <LoadingShade isLoading={isLoading} />
    </View>
  );
}

function RoundButton({
  title,
  onPress,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`py-2 rounded-md active:opacity-50 ${
        disabled ? "bg-gray-500" : "bg-tint"
      }`}
    >
      <Text className="text-xl text-center text-white">{title}</Text>
    </Pressable>
  );
}
