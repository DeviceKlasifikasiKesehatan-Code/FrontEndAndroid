import { StyleSheet, Dimensions } from 'react-native'

const HospitalMapsStyle = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Dimensions.get('window').height * 0.065,
    paddingHorizontal: 5,
    backgroundColor: '#FFFFFF',
    zIndex: 1
  },
  backButton: {
    padding: 10
  },
  focusButton: {
    padding: 10
  },
  title: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    fontFamily: 'MontserratBold'
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 60
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default HospitalMapsStyle
