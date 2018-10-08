import React from 'react';
import {StyleSheet, Text, View, Alert, Image, TouchableHighlight, BackHandler} from 'react-native';
import MessageList from './components/MessageList';
import {createLocationMessage, createImageMessage, createTextMesage} from './utils/MessageUtils'
import Status from './components/Status'
import Toolbar from './components/Toolbar';

export default class App extends React.Component {
    state = {
        messages: [
            createTextMesage('World'),
            createImageMessage('https://vcdn-ngoisao.vnecdn.net/2018/07/16/ngoc-trinh-ok1-4066-1531708195.jpg'),
            createTextMesage('Hello'),
            createLocationMessage({
                latitude: 21.027205,
                longitude: 105.773623,
            }),
            createTextMesage('Hello'),
            createTextMesage('Anh Tung dep trai'),
        ],
        fullscreenImageId: null,
        isInputFocused: false,
    };
    handlePressToolbarCamera = () => {
// ...
    };
    handlePressToolbarLocation = () => {
        const { messages } = this.state;
// todo lấy ra vị trí hiện tại thiết bị
        navigator.geolocation.getCurrentPosition(position => {
            console.log(position);
            const { coords: { latitude, longitude } } = position;

            this.setState({
                messages: [
                    createLocationMessage({
                        latitude,
                        longitude,
                    }),
                    ...messages,
                ],
            });
        });
    };


    handleChangeFocus = (isFocused) => {
        this.setState({ isInputFocused: isFocused });
    };
    handleSubmit = (text) => {
        const { messages } = this.state;
        this.setState({
            messages: [createTextMesage(text), ...messages],
        });
    };
    renderToolbar() {
        const { isInputFocused } = this.state;
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

    componentWillMount() {
        // todo event nút back nếu là trên Adnroid
        this.subcription = BackHandler.addEventListener('hardwareBackPress', () => {
            const {fullscreenImageId} = this.state;
            if (fullscreenImageId) {
                this.dismissFullscreenImage();
                return true;
            }
            return false;
        })
    }

    componentWillUnmount() {
        this.subcription.remove();
    }

    dismissFullscreenImage = () => {
        this.setState({fullscreenImageId: null});
    };
    renderFullscreenImage = () => {
        const {messages, fullscreenImageId} = this.state;

        if (!fullscreenImageId) return null;

        const image = messages.find(message => message.id === fullscreenImageId);

        if (!image) return null;

        const {uri} = image;

        return (
            <TouchableHighlight
                style={styles.fullscreenOverlay}
                onPress={this.dismissFullscreenImage}
            >
                <Image style={styles.fullscreenImage} source={{uri}}/>
            </TouchableHighlight>
        );
    };
    handlePressMessage = ({id, type}) => {
        switch (type) {
            case 'text':
                Alert.alert(
                    'Alert',
                    'Are you sure you want to delete ?',
                    [
                        {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {
                            text: 'Yes', onPress: () => {
                                const {messages} = this.state;
                                this.setState({
                                    messages: messages.filter((message) => {
                                        return message.id !== id
                                    })
                                })
                            }
                        },
                    ],
                    {cancelable: true}
                );
                break;
            case 'image':
                this.setState({fullscreenImageId: id,isInputFocused:false });
                break;

        }
    };

    renderMessageList() {
        const {messages} = this.state;
        return (
            <View style={styles.content}>
                <MessageList messages={messages} onPressMessage={this.handlePressMessage}/>
            </View>
        );
    };
    renderInputMethodEditor() {
        return (
            <View style={styles.inputMethodEditor}>

            </View>
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <Status/>
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
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        backgroundColor: '#fff',
    },
    inputMethodEditor: {
        flex: 1,
        backgroundColor: '#fff'
    },
    toolbar: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.04)',
        backgroundColor: 'white',
    },
    fullscreenImage: {
        flex: 1,
        resizeMode: 'contain'
    },
    // todo bao phủ toàn màn hình, sẽ bao phủ lên trên cungf
    fullscreenOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'black',
        zIndex: 2,
    },
});
