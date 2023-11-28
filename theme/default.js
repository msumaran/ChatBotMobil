import { TextInput, Pressable, View, Text } from "react-native";
import { styled } from "nativewind";

export const Container = styled(
    View,
    "font-poppins flex-1 justify-center items-center bg-gray-100"
);


export const StyledInput = styled(
    TextInput,
    "font-poppins mb-4 p-4 w-3/4 bg-white border border-gray-300 rounded-lg"
);
export const StyledButton = styled(
    Pressable,
    "font-poppins w-3/4 bg-blue-500 p-4 rounded-lg"
);
export const StyleTextButton = styled(Text, "font-poppins w-full text-white text-center font-bold");

export const StyleText = styled(StyleTextButton, "font-poppins");

