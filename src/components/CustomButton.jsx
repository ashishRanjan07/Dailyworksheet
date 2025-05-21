import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SkypeIndicator } from "react-native-indicators";
import PropTypes from "prop-types";
import { moderateScale, textScale } from "../utils/responsiveSize";
import Colors from "../utils/Colors";

const CustomButton = ({
  text,
  handleAction,
  buttonStyle,
  textStyle,
  isloading = false,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[styles.main, { ...buttonStyle }]}
      onPress={handleAction}
      activeOpacity={0.8}
      {...props}
    >
      {isloading ? (
        <SkypeIndicator color={Colors.white} size={moderateScale(22)} />
      ) : (
        <Text style={[styles.text, { ...textStyle }]}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

CustomButton.propTypes = {
  text: PropTypes.string.isRequired,
  handleAction: PropTypes.func.isRequired,
  buttonStyle: PropTypes.object,
  textStyle: PropTypes.object,
  isloading: PropTypes.bool,
};
export default CustomButton;

const styles = StyleSheet.create({
  main: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
  },
  text: {
    color: Colors.white,
    fontSize: textScale(14),
  },
});
