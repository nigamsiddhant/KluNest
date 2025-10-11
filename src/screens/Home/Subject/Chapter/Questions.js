import React, { useState } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import Video from "react-native-video";

const Questions = ({ index, question, totalQuestions, topicName, item, selectedIndex }) => {
  const [playingVideoId, setPlayingVideoId] = useState(null);

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
        item.topics[selectedIndex].questions.map((questionItem, questionIndex) => {
          const isImageUrl = questionItem.content_url && /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(questionItem.content_url);
          const isVideoUrl = questionItem.content_url && /\.(mp4|mov|avi|mkv|webm|m4v)$/i.test(questionItem.content_url);
          const videoId = questionItem.id ? questionItem.id.toString() : questionIndex.toString();
          const isPlaying = playingVideoId === videoId;

          return (
            <View key={videoId} style={styles.questionBox}>
              <Text style={styles.questionNumber}>
                Q{questionIndex + 1}.
              </Text>
              <Text style={styles.questionText}>
                {questionItem.question}
              </Text>
              {isImageUrl && (
                <Image
                  source={{ uri: questionItem.content_url }}
                  style={styles.questionImage}
                  resizeMode="contain"
                />
              )}
              {isVideoUrl && (
                <View style={styles.videoContainer}>
                  <Video
                    source={{ uri: questionItem.content_url }}
                    style={styles.video}
                    controls={true}
                    paused={!isPlaying}
                    resizeMode="contain"
                    onEnd={() => setPlayingVideoId(null)}
                  />
                  {!isPlaying && (
                    <TouchableOpacity
                      style={styles.playButton}
                      onPress={() => setPlayingVideoId(videoId)}
                    >
                      <View style={styles.playIconContainer}>
                        <Text style={styles.playIcon}>▶</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          );
        })
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
  questionImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
  videoContainer: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: '#000',
    overflow: 'hidden',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 24,
    color: '#1ABC9C',
    marginLeft: 4,
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