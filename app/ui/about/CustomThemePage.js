/**
 * 自定义主题
 * @hisign
 * **/
import React, {Component} from "react";
import {
    DeviceEventEmitter,
    StyleSheet,
    View,
    Image,
    Modal, Text,
    Platform,
    ScrollView,
    TouchableOpacity
} from "react-native";
import ThemeFactory, {ThemeFlags} from "../../res/styles/ThemeFactory";
import HistorySearchDao from "../../dao/HistorySearchDao";
import GlobalStyles from '../../res/styles/GlobalStyles'
import Constants from '../../res/Constants'

export default class CustomTheme extends Component {

    constructor(props) {
        super(props);
        this.historySearchDao = new HistorySearchDao();
    }

    onSelectTheme(themeKey) {
        this.historySearchDao.saveThemeDataToLocal(ThemeFlags[themeKey]);
        this.props.onClose();
        //发送主题改变通知
        DeviceEventEmitter.emit(Constants.ThemeChangeEventKey,ThemeFactory.createTheme(ThemeFlags[themeKey]));
    }

    renderCustomThemeView() {
        return (<Modal
            animationType={"slide"}
            transparent={true}
            visible={this.props.visible}
            onRequestClose={() => {
                this.props.onClose();
            }}
        >
            <ScrollView style={styles.modalContainer}>
                {this.renderThemeItems()}
            </ScrollView>
        </Modal>)
    }

    getThemeItem(themeKey) {
        return (
            <TouchableOpacity activeOpacity={0.8}
                style={{flex: 1}}
                underlayColor='white'
                onPress={()=>this.onSelectTheme(themeKey)}>
                <View style={[{backgroundColor: ThemeFlags[themeKey]}, styles.themeItem]}>
                    <Text style={styles.themeText}>{themeKey}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    renderThemeItems() {
        var views = [];
        for (let i = 0, keys = Object.keys(ThemeFlags), l = keys.length; i < l; i += 3) {
            key1 = keys[i], key2 = keys[i + 1], key3 = keys[i + 2];
            views.push(<View key={i} style={{flexDirection: 'row'}}>
                {this.getThemeItem(key1)}
                {this.getThemeItem(key2)}
                {this.getThemeItem(key3)}
            </View>)
        }
        return views;
    }

    render() {
        let view = this.props.visible ? <View style={GlobalStyles.listView_container}>
            {this.renderCustomThemeView()}
        </View> : null;
        return view
    }

}
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        margin: 10,
        marginTop: Platform.OS === 'ios' ? 20 : 10,
        backgroundColor: 'white',
        borderRadius: 3,
        shadowColor: 'gray',
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.5,
        shadowRadius: 2,
        padding: 3
    },
    themeItem: {
        flex: 1,
        height: 120,
        margin: 3,
        padding: 3,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    themeText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 16,
    }
})