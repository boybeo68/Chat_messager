import React, {Component} from 'react';
import {Constants} from 'expo'
import {View, Text, StyleSheet, NetInfo, Platform, StatusBar,} from 'react-native';

// import styles from './styles';


export default class  extends Component {

    constructor(props) {
        super(props);
        this.state = {
            connectionType: null
        };
    }

    async componentWillMount() {
        this.subscription = NetInfo.addEventListener(
            'connectionChange',
            this.handleChange,
        );
        const {type} = await NetInfo.getConnectionInfo();
        console.log(type);
        this.setState({connectionType:type});
    }
    componentWillUnmount(){
        this.subscription.remove();
    }

    handleChange = (connectionType) => {
        this.setState({connectionType})
    };

    render() {
        const {info} = this.state;
        const isConnected = info !== 'none';
        const backgroundColor = isConnected ? 'white' : 'red';
        const statusBar = (
            <StatusBar
                backgroundColor={backgroundColor}
                barStyle={isConnected ? 'dark-content' : 'light-content'}
                animated={false}
            />
        );
        const messageContainer = (
            <View style={styles.messageContainer} pointerEvents={'none'}>
                {statusBar}
                {!isConnected && (
                    <View style={styles.bubble}>
                        <Text style={styles.text}>No network connection</Text>
                    </View>
                )}
            </View>
        );
        if (Platform.OS === 'ios') {
            return <View style={[styles.status, {backgroundColor}]}> {messageContainer}</View>
        }
        return messageContainer;
    }
}
//todo ios phải config status bar
const statusHeight = Platform.OS === 'ios' ? Constants.statusBarHeight : 0;
const styles = StyleSheet.create({
    status: {
        zIndex: 1,
        height: statusHeight,
    },
    messageContainer: {
        zIndex: 1,
        position: 'absolute',
        top: statusHeight + 20,
        right: 0,
        left: 0,
        height: 80,
        alignItems: 'center',
    },
    bubble: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'red',
    },
    text: {
        color: '#fff'
    }
});