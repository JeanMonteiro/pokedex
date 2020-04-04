import {NavigationActions} from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName: string, params?: any): void {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  );
}

function showBottomBar(screen) {
  const setParamsAction = NavigationActions.setParams({
    params: {tabBarVisible: true},
    key: screen,
  });
  _navigator.dispatch(setParamsAction);
}

function hideBottomBar(screen) {
  const setParamsAction = NavigationActions.setParams({
    params: {tabBarVisible: false},
    key: screen,
  });
  _navigator.dispatch(setParamsAction);
}

function goBack() {
  _navigator.dispatch(NavigationActions.back());
}

// add other navigation functions that you need and export them
export default {
  navigate,
  goBack,
  hideBottomBar,
  showBottomBar,
  setTopLevelNavigator,
};
