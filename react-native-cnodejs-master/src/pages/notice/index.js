import React, { PureComponent } from 'react';
import { connect } from 'dva/mobile';
import Message from './components/Message';
import { StyleSheet, View, ScrollView, RefreshControl, Text, Button, Image, StatusBar, FlatList, Dimensions, TouchableOpacity } from 'react-native'

const { width } = Dimensions.get('window');

class Notice extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  static navigationOptions = ({ navigation }) => {
    const { state, setParams, navigate } = navigation;
    return {
      headerTitle: '消息',
      tabBarIcon: ({ focused, tintColor }) => (
        <Image
          resizeMode="contain"
          style={styles.iconBtn}
          source={!focused ? require('../../assets/images/notic_0.png') : require('../../assets/images/notic_1.png')} />
      ),
      tabBarLabel: '通知',
    };
  };

  componentDidMount() {
    this.props.init()
  }

  render() {
    const { data, has_read_messages, hasnot_read_messages, accesstoken, loading } = this.props
    const { navigate } = this.props.navigation;

    return (
      <ScrollView style={styles.container} refreshControl={<RefreshControl onRefresh={() => { this.props.query({ accesstoken }) }} refreshing={loading} />}>
        <StatusBar barStyle="light-content" />
        <View style={styles.rowList}>
          <TouchableOpacity onPress={() => { navigate('System') }}>
            <View style={styles.row}>
              <Image style={styles.rowImg} source={require('../../assets/images/notice.png')} resizeMode='contain' />
              <View style={styles.rowInner}>
                <Text style={styles.rowText}>系统消息</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { navigate('Read') }}>
            <View style={styles.row}>
              <Image style={styles.rowImg} source={require('../../assets/images/comment.png')} resizeMode='contain' />
              <View style={styles.rowInner}>
                <Text style={styles.rowText}>已读消息</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {
          hasnot_read_messages.length > 0 ?
            <View style={styles.rowList}>
              <FlatList
                style={{ width: width }}
                data={hasnot_read_messages}
                extraData={this.state}
                keyExtractor={(item, index) => index}
                renderItem={({ item }) => <Message navigate={navigate} item={item} />}
              />
            </View>
            : <View style={styles.msgViw}>
              <Text style={styles.msg}>暂无消息</Text>
            </View>
        }
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  const { data, has_read_messages, hasnot_read_messages, accesstoken, loading } = state.notice;
  return { data, has_read_messages, hasnot_read_messages, accesstoken, loading };
}

function mapDispatchToProps(dispatch) {
  return {
    init() {
      dispatch({
        type: 'notice/init',
      });
    },
    query(params) {
      dispatch({
        type: 'notice/query',
        payload: params,
      });
    },
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },

  rowList: {
    marginTop: 10,
  },

  row: {
    paddingLeft: 27,
    paddingRight: 27,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },

  rowImg: {
    width: 20,
    height: 20,
    marginRight: 20,
  },

  rowInner: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 0.5,
    borderColor: '#F0F0F0',
  },

  rowText: {
    fontSize: 16,
    fontWeight: '400',
  },

  iconBtn: {
    width: 25,
    height: 25,
  },

  msgViw: {
    padding: 30,
    justifyContent: 'center',
  },

  msg: {
    textAlign: 'center',
    fontSize: 14,
    color: '#999'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Notice);
