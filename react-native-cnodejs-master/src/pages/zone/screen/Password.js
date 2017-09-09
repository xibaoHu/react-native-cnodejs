import React, { PureComponent } from 'react';
import { connect } from 'dva/mobile';
import { StyleSheet, View, Text, Button, Image, StatusBar, FlatList, Dimensions, TouchableOpacity } from 'react-native'

class Password extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  static navigationOptions = ({ navigation }) => {
    const { state, setParams } = navigation;
    return {
      headerTitle: '修改密码',
    };
  };

  componentDidMount() {
    const { params } = this.props.navigation.state;
    // this.props.query(params)
  }

  componentWillReceiveProps(next) {
    const { params } = this.props;
    if (next.params !== params) {

    }
  }

  render() {
    const { data, loading } = this.props
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.msgViw}>
          <Text style={styles.msg}>暂不支持</Text>
        </View>
      </View >
    );
  }
}

function mapStateToProps(state) {
  const { data, loading } = state.zone;
  return { data, loading };
}

function mapDispatchToProps(dispatch) {
  return {
    query(params) {
      dispatch({
        type: 'zone/query',
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

export default connect(mapStateToProps, mapDispatchToProps)(Password);
