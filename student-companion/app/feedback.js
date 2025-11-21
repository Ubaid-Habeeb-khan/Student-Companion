import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";   // ✅ Correct place

export default function FeedbackScreen() {

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const sendFeedback = async () => {
    if (!name || !message) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const response = await fetch("https://telemetry-api-iota.vercel.app/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          message
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Feedback sent!");
        setName("");
        setMessage("");
      } else {
        Alert.alert("Error", "Something went wrong.");
      }

    } catch (err) {
      Alert.alert("Network Error", "Could not reach server.");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: "700", marginBottom: 20 }}>
        Feedback
      </Text>

      <TextInput
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          padding: 12,
          borderRadius: 10,
          marginBottom: 15
        }}
      />

      <TextInput
        placeholder="Your Feedback"
        value={message}
        onChangeText={setMessage}
        multiline
        style={{
          borderWidth: 1,
          padding: 12,
          borderRadius: 10,
          height: 120,
          marginBottom: 15
        }}
      />

      <TouchableOpacity
        onPress={sendFeedback}
        style={{
          backgroundColor: "cyan",
          padding: 14,
          borderRadius: 10
        }}
      >
        <Text style={{ textAlign: "center", fontWeight: "700", fontSize: 16 }}>
          Submit
        </Text>
      </TouchableOpacity>
    </View>
  );
}
