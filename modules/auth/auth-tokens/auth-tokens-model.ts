import { AuthTokenMaker } from './auth-tokens-resource.ts';


AuthTokenMaker.setProperties({
  user: {
    type: 'string',
    ref: 'User',
    required: true,
    title: 'کاربر',
    titleable: true
  },
  token: {
    type: 'string',
    required: true,
    title: 'توکن'
  },
  valid: {
    type: 'boolean',
    required: true,
    default: false,
    title: 'معتبر'
  },
  validUntil: {
    type: 'number',
    title: 'زمان اعتبار'
  },
  usedAt: {
    type: 'number',
    array: true,
    title: 'زمان‌های استفاده'
  },
  invalidatedAt: {
    type: 'number',
    title: 'زمان انقضا'
  }
});


AuthTokenMaker.makeModel();
