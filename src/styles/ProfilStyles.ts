export default {
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  topContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 75,
    paddingHorizontal: 20,
    backgroundColor: '#133E87',
    gap: 20
  },
  backContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    width: '100%'
  },
  backButton: {
    color: 'white'
  },
  headerTitle: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'MontserratBold'
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  userName: {
    fontSize: 20,
    fontFamily: 'MontserratBold',
    color: 'white'
  },
  bottomContainer: {
    marginTop: -50,
    padding: 20,
    paddingVertical: 35,
    width: '85%',
    backgroundColor: '#F3F3E0',
    alignSelf: 'center',
    borderRadius: 15,
    gap: 10,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,

    elevation: 5
  },
  label: {
    fontSize: 14,
    marginTop: 10,
    flexShrink: 1,
    fontFamily: 'MontserratSemiBold',
    flexWrap: 'wrap'
  },
  value: {
    fontSize: 14,
    color: '#555',
    flexShrink: 1,
    fontFamily: 'MontserratMedium',
    flexWrap: 'wrap'
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(19, 62, 135, 0.25)',
    padding: 0
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  editButton: {
    padding: 3,
    borderRadius: 5,
    backgroundColor: '#FFFFFF'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cancelButton: {
    padding: 10
  },
  cancelText: {
    fontSize: 16,
    color: 'red'
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5
  },
  saveText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold'
  }
}
