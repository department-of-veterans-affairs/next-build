/**
 * Jest mock module for @/components/vamcSystem/vamcSystemAndMenu
 *
 * This module provides a Jest mock function for getVamcSystemAndMenu
 * that returns mock data from mock.shallow.json and mock.menu.json
 */

import mockVamcSystem from '../mock.shallow.json'
import mockMenu from '../mock.menu.json'

/**
 * Mock implementation of getVamcSystemAndMenu
 * Returns vamcSystem data from mock.shallow.json and menu data from mock.menu.json
 */
export const getVamcSystemAndMenu = jest.fn(() => {
  return {
    vamcSystem: mockVamcSystem,
    menu: mockMenu,
  }
})
