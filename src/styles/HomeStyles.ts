import { StyleSheet, Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    paddingTop: height * 0.06,
    backgroundColor: '#fff',
    flex: 1,
    alignContent: 'center'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#133E87'
  },
  locationContainer: {
    justifyContent: 'flex-end',
    alignContent: 'flex-end'
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'right',
    fontFamily: 'MontserratSemiBold'
  },
  menuButton: {
    fontSize: 24
  },
  lastRecord: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 15,
    alignItems: 'stretch'
  },
  lastRecordContainer: {
    width: '48%',
    justifyContent: 'space-between'
  },
  lastRecordButton: {
    justifyContent: 'center',
    padding: 10,
    width: '100%',
    backgroundColor: '#F3F3E0',
    borderRadius: 15,

    // Shadow untuk iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    // Shadow untuk Android
    elevation: 5
  },

  lastRecordTitle: {
    fontSize: 24,
    textAlign: 'left',
    fontFamily: 'MontserratSemiBold'
  },

  lastResultContainer: {
    width: '48%',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#133E87',
    borderRadius: 10,
    // Shadow untuk iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    gap: 10,

    // Shadow untuk Android
    elevation: 5
  },

  resultTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    // justifyContent: 'left',
    gap: 10
  },

  logoResult: {
    width: 35,
    height: 35
  },

  resultText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'left',
    fontFamily: 'MontserratBold'
  },

  resultSatuan: {
    color: 'white',
    fontSize: 12,
    textAlign: 'left',
    fontFamily: 'MontserratBold'
  },

  buttonText: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'MontserratMedium'
  },
  sectionTitle: {
    paddingHorizontal: 20,
    fontSize: 20,
    textAlign: 'left',
    fontFamily: 'MontserratMedium'
  },
  recordText: {
    fontSize: 16,
    color: '#555'
  },
  history: {
    flex: 1
  },
  historyList: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 40,
    height: '100%'
  },
  historyItem: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F3F3E0',
    borderRadius: 15,
    marginBottom: 10,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    // Shadow untuk Android
    elevation: 5
  },
  historyItemTanggal: {
    fontSize: 11,
    textAlign: 'left',
    fontFamily: 'MontserratMedium',
    textDecorationLine: 'underline',
    color: 'green'
  },
  historyItemDurasi: {
    fontSize: 16,
    textAlign: 'left',
    fontFamily: 'MontserratMedium'
  }
})

export default styles
