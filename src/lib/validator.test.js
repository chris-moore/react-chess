import Validator from './Validator';
import React from 'react';
import ReactDOM from 'react-dom';

describe('Validator', () => {
  test('exists', () => {
    expect(Validator.validMoves).toBeDefined();
  });
});
