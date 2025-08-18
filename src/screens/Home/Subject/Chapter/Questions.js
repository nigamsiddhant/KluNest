import React from "react";
import { View, StyleSheet, Text } from "react-native";
import data from "../Chapter/QuestionsData";

const Questions = ({ index, question,totalQuestions }) => {
  return (
    <View style={{}}>
      {/* Question Counter */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        <Text
          style={{ color: "#333", fontSize: 15,  marginRight: 2 }}
        >
          {index + 1}
        </Text>
        <Text style={{ color: "#333", fontSize: 13, opacity: 0.6, }}>
          / {totalQuestions}
        </Text>
      </View>

      {/* Question */}
      <Text
        style={{
          color: "#333",
          // opacity: 0.6,
          fontSize: 18,
          marginVertical:8,
          textAlign: "justify",
        }}
      >
        {question}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Questions;