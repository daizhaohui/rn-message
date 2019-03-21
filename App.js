import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  TouchableHighlight
} from "react-native";
import Status from "./components/Status";
import MessageList from "./components/MessageList";
import {
  createImageMessage,
  createLocationMessage,
  createTextMessage
} from "./utils/MessageUtils";
import ToolBar from "./components/Toolbar";
import ImageGrid from "./components/ImageGrid";

export default class App extends React.Component {
  state = {
    messages: [
      createImageMessage("https://unsplash.it/300/300"),
      createTextMessage("World"),
      createTextMessage("Hello"),
      createLocationMessage({
        latitude: 37.78825,
        longitude: -122.4324
      })
    ],
    fullscreenImageId: null,
    isInputFocused: false
  };

  dismissFullscreenImage = () => {
    this.setState({ fullscreenImageId: null });
  };

  handlePressMessage = ({ id, type }) => {
    switch (type) {
      case "text":
        Alert.alert(
          "Delete message?",
          "Are you sure you want to permanently delete this message?",
          [
            {
              text: "Cancel",
              style: "cancel"
            },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => {
                const { messages } = this.state;
                this.setState({
                  messages: messages.filter(message => message.id !== id)
                });
              }
            }
          ]
        );
        break;
      case "image":
        this.setState({ fullscreenImageId: id, isInputFocused: false });
        break;
      default:
        break;
    }
  };

  handlePressImage = uri => {
    const { messages } = this.state;
    this.setState({
      messages: [createImageMessage(uri), ...messages]
    });
  };

  handlePressToolbarCamera = () => {};

  handlePressToolbarLocation = () => {
    const { messages } = this.state;
    navigator.geolocation.getCurrentPosition(position => {
      const {
        coords: { latitude, longitude }
      } = position;
      this.setState({
        messages: [
          createLocationMessage({
            latitude,
            longitude
          }),
          ...messages
        ]
      });
    });
  };

  handleChangeFocus = isFocused => {
    this.setState({ isInputFocused: isFocused });
  };
  handleSubmit = text => {
    const { messages } = this.state;
    this.setState({
      messages: [createTextMessage(text), ...messages]
    });
  };

  renderMessageList() {
    const { messages } = this.state;
    return (
      <View style={styles.container}>
        <MessageList
          messages={messages}
          onPressMessage={this.handlePressMessage}
        />
      </View>
    );
  }

  renderInputMethodEditor() {
    return (
      <View style={styles.inputMethodEditor}>
        <ImageGrid onPressImage={this.handlePressImage} />
      </View>
    );
  }

  renderToolbar() {
    return (
      <View style={styles.toolbar}>
        <Toolbar
          isFocused={isInputFocused}
          onSubmit={this.handleSubmit}
          onChangeFocus={this.handleChangeFocus}
          onPressCamera={this.handlePressToolbarCamera}
          onPressLocation={this.handlePressToolbarLocation}
        />
      </View>
    );
  }

  renderFullscreenImage = () => {
    const { messages, fullscreenImageId } = this.state;
    if (!fullscreenImageId) return null;
    const image = messages.find(message => message.id === fullscreenImageId);
    if (!image) return null;
    const { uri } = image;
    return (
      <TouchableHighlight
        style={styles.fullscreenOverlay}
        onPress={this.dismissFullscreenImage}
      >
        <Image style={styles.fullscreenImage} source={{ uri }} />
      </TouchableHighlight>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Status />
        {this.renderMessageList()}
        {this.renderToolbar()}
        {this.renderInputMethodEditor()}
        {this.renderFullscreenImage()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  content: {
    flex: 1,
    backgroundColor: "white"
  },
  inputMethodEditor: {
    flex: 1,
    backgroundColor: "white"
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.04)",
    backgroundColor: "white"
  },
  fullscreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
    zIndex: 2
  },
  fullscreenImage: {
    flex: 1,
    resizeMode: "contain"
  }
});
