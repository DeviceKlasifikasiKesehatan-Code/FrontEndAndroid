import { StyleSheet, Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#133E87',
    justifyContent: 'flex-end'
  },
  loginContainer: {
    height: height * 0.75,
    backgroundColor: '#fff',
    // justifyContent: 'space-between',
    borderStartStartRadius: 100,
    borderEndStartRadius: 100,
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center'
  },
  logo: {
    width: 230,
    height: 230,
    marginTop: -100
  },
  title: {
    fontSize: 36,
    fontFamily: 'MontserratSemiBold',
    textAlign: 'center',
    marginTop: '15%',
    marginBottom: 20
  },
  input: {
    width: '85%',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    fontFamily: 'Montserrat'
  },
  passwordContainer: {
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 7
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontFamily: 'Montserrat'
  },
  passwordInput: {
    flex: 1,
    fontFamily: 'Montserrat'
  },
  showHideButton: {
    marginLeft: 10
  },
  loginButton: {
    backgroundColor: '#608BC1',
    padding: 15,
    borderRadius: 300,
    width: '85%',
    marginTop: 20,
    marginBottom: '10%'
  },
  loginText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Montserrat'
  },
  askRegis: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    paddingBottom: 10,
    gap: 5
  },
  askRegisText: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Montserrat'
  },
  underline: {
    textDecorationLine: 'underline',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Montserrat'
  }
})

export default styles
