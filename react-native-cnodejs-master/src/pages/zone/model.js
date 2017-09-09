import * as service from './service';
import { AsyncStorage } from 'react-native'

export default {
  namespace: 'zone',
  state: {
    user: {},
    data: {},
    info: {},
    collects: [],
    other_data: {},
    accesstoken: '',
    setting: { draft: true, notic: true },
    loading: false,
  },
  effects: {
    *init({ payload = {} }, { call, put }) {
      var user = yield AsyncStorage.getItem('user')
      var accesstoken = yield AsyncStorage.getItem('accesstoken')
      var setting = yield AsyncStorage.getItem('setting')
      if (user) yield put({ type: 'query', payload: JSON.parse(user) })
      if (accesstoken) yield put({ type: 'token', payload: accesstoken })
      if (setting) yield put({ type: 'config', payload: JSON.parse(setting) })
    },
    *login({ payload = {} }, { call, put }) {
      const { accesstoken } = payload
      yield put({ type: 'loading', payload: true });
      const { data, err } = yield call(service.postToken, payload);
      yield put({ type: 'loading', payload: false });
      if (err) return console.log(err)
      yield put({ type: 'login/success', payload: data });
      AsyncStorage.setItem('accesstoken', accesstoken);
      yield put({ type: 'token', payload: accesstoken });
      const [, user] = data
      yield put({ type: 'query', payload: user });
    },
    *query({ payload = {} }, { call, put }) {
      const { loginname } = payload
      yield put({ type: 'loading', payload: true });
      yield put({ type: 'user', payload: payload });
      const { data, err } = yield call(service.queryUser, { user: loginname });
      yield put({ type: 'loading', payload: false });
      if (err) return console.log(err)
      yield put({ type: 'query/success', payload: data });
    },
    *otherInfo({ payload = {} }, { call, put }) {
      yield put({ type: 'loading', payload: true });
      const { data, err } = yield call(service.queryUser, payload);
      yield put({ type: 'loading', payload: false });
      if (err) return console.log(err)
      yield put({ type: 'otherInfo/success', payload: data });
    },
    *information({ payload = {} }, { call, put }) {
      yield put({ type: 'loading', payload: true });
      const { data, err } = yield call(service.queryInfo, payload);
      yield put({ type: 'loading', payload: false });
      if (err) return console.log(err)
      yield put({ type: 'information/success', payload: data });
    },
    *collects({ payload = {} }, { call, put }) {
      yield put({ type: 'loading', payload: true });
      const { data, err } = yield call(service.queryCollects, payload);
      yield put({ type: 'loading', payload: false });
      if (err) return console.log(err)
      yield put({ type: 'collects/success', payload: data });
    },
  },
  reducers: {
    'login/success'(state, { payload }) {
      const [, data] = payload
      AsyncStorage.setItem('user', JSON.stringify(data));
      return { ...state, user: data };
    },
    'query/success'(state, { payload }) {
      const [, result] = payload
      const data = service.parseUser(result.data)
      return { ...state, data };
    },
    'otherInfo/success'(state, { payload }) {
      const [, result] = payload
      const data = service.parseUser(result.data)
      return { ...state, other_data: data };
    },
    'information/success'(state, { payload }) {
      const [, data] = payload
      const info = service.parseInfo(data)
      return { ...state, info };
    },
    'collects/success'(state, { payload }) {
      const [, data] = payload
      const collects = service.parseCollects(data.data)
      return { ...state, collects };
    },
    'de_collect'(state, { payload }) {
      const collects = state.collects.filter(collect => collect.id !== payload);
      return { ...state, collects };
    },
    'loading'(state, { payload: data }) {
      return { ...state, loading: data };
    },
    'user'(state, { payload: data = {} }) {
      return { ...state, user: data };
    },
    'token'(state, { payload: data }) {
      return { ...state, accesstoken: data };
    },
    'config'(state, { payload: data = {} }) {
      AsyncStorage.setItem('setting', JSON.stringify(data));
      return { ...state, setting: data };
    },
    'cleanInfo'(state) {
      return { ...state, info: {} };
    },
    'clean'(state, { payload: data }) {
      AsyncStorage.removeItem('user')
      AsyncStorage.removeItem('accesstoken')
      return { ...state, data: {} };
    },
  },
  subscriptions: {},
};
