import * as service from './service';

export default {
  namespace: 'recruit',
  state: {
    page: 1,
    data: [],
    loading: false,
  },
  effects: {
    *query({ payload = {} }, { call, put }) {
      const { page = 1 } = payload
      yield put({ type: 'loading', payload: true });
      const { data, err } = yield call(service.queryTopics, payload);
      yield put({ type: 'loading', payload: false });
      if (err) return console.log(err)
      yield put({ type: 'page', payload: page });
      if (page == 1) yield put({ type: 'query/success', payload: data });
      else yield put({ type: 'more/success', payload: data });
    },
  },
  reducers: {
    'query/success'(state, { payload }) {
      const [, data] = payload
      const topics = service.parseTopics(data.data)
      return { ...state, data: topics };
    },
    'more/success'(state, { payload }) {
      const [, data] = payload
      const topics = service.parseTopics(data.data)
      return { ...state, data: [...state.data, ...topics] };
    },
    'page'(state, { payload: data }) {
      return { ...state, page: data };
    },
    'loading'(state, { payload: data }) {
      return { ...state, loading: data };
    },
  },
  subscriptions: {},
};
