import React from "react";
import { View, StyleSheet, Text } from "react-native";

const Questions = ({ index, question, totalQuestions, topicName, item, selectedIndex }) => {
  console.log("siddhant question logs::", item);
  return (
    <View style={{}}>
      {/* Question Counter */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{ color: "#333", fontSize: 15 }}
        >
          {topicName}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <Text
            style={{ color: "#333", fontSize: 15, marginRight: 2 }}
          >
            {selectedIndex + 1}
          </Text>
          <Text style={{ color: "#333", fontSize: 13, opacity: 0.6 }}>
            / {totalQuestions}
          </Text>
        </View>
      </View>

      {/* Divider Line */}
      <View style={styles.divider} />

      {/* Questions List */}
      {item.topics[selectedIndex]?.questions && item.topics[selectedIndex].questions.length > 0 ? (
        item.topics[selectedIndex].questions.map((questionItem, questionIndex) => (
          <View key={questionItem.id ? questionItem.id.toString() : questionIndex.toString()} style={styles.questionBox}>
            <Text style={styles.questionNumber}>
              Q{questionIndex + 1}.
            </Text>
            <Text style={styles.questionText}>
              {questionItem.question}
            </Text>
          </View>
        ))
      ) : (
        <View style={styles.noQuestionsBox}>
          <Text style={styles.noQuestionsText}>No questions available</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  questionBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1ABC9C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionNumber: {
    color: '#1ABC9C',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  questionText: {
    color: '#333',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
  noQuestionsBox: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 20,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
    alignItems: 'center',
  },
  noQuestionsText: {
    color: '#856404',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Questions;