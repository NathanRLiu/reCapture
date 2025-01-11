import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function FriendsPage() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  const [friends, setFriends] = useState<string[]>([]);
  const [inputNumber, setInputNumber] = useState('');

  const addFriend = () => {
    if (inputNumber.trim() === '') {
      Alert.alert('Error', 'Please enter a valid number.');
      return;
    }

    setFriends((prevFriends) => [...prevFriends, inputNumber]);
    setInputNumber('');
    Alert.alert('Success', 'Friend request sent!');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}> 
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>Friends</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { color: themeColors.text, borderColor: themeColors.text }]}
          placeholder="Enter friend's number"
          placeholderTextColor={themeColors.icon} // Use 'icon' as a fallback
          value={inputNumber}
          onChangeText={setInputNumber}
          keyboardType="number-pad"
        />
        <TouchableOpacity style={[styles.addButton, { backgroundColor: themeColors.tint }]} onPress={addFriend}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.friendListContainer}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Friend Requests</Text>
        <FlatList
          data={friends}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.friendItem, { borderColor: themeColors.text }]}>
              <Text style={[styles.friendText, { color: themeColors.text }]}>{item}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: themeColors.icon }]}>No friend requests sent yet.</Text>
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  addButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  friendListContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  friendItem: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  friendText: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
});
