import * as React from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import {
  showChatHead,
  hideChatHead,
  updateChatBadgeCount,
  requestPermission,
  checkOverlayPermission,
} from 'react-native-chat-head';

export default function App() {
  const [granted, setGranted] = React.useState(false);

  const _requestPermission = async () => {
    setGranted(await requestPermission());
  };

  const _checkPermission = async () => {
    setGranted(await checkOverlayPermission());
  };

  return (
    <View style={styles.container}>
      <Text>granted: {granted ? 'true' : 'false'}</Text>
      <Button title="checkOverlayPermission" onPress={_checkPermission} />
      <Button title="requestPermission" onPress={_requestPermission} />
      <Button
        title="Show Chat Head"
        onPress={() => showChatHead()}
        disabled={!granted}
      />
      <Button
        title="Hide Chat Head"
        onPress={() => hideChatHead()}
        disabled={!granted}
      />
      <Button
        title="Update Chat Head Text"
        disabled={!granted}
        onPress={() => updateChatBadgeCount(15)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
