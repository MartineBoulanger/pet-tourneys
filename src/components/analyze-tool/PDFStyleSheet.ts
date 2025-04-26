import { StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helvetica/v15/Helvetica.ttf' },
    {
      src: 'https://fonts.gstatic.com/s/helvetica/v15/Helvetica-Bold.ttf',
      fontWeight: 'bold',
    },
    {
      src: 'https://fonts.gstatic.com/s/helvetica/v15/Helvetica-Oblique.ttf',
      fontStyle: 'italic',
    },
  ],
});

// Create styles
export const styles = StyleSheet.create({
  coverPage: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: '#303030',
    padding: 40,
  },
  coverTitle: {
    fontSize: 32,
    color: '#f1f1f1',
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  coverSubtitle: {
    fontSize: 18,
    color: '#f1f1f1',
    marginBottom: 40,
    textAlign: 'center',
  },
  coverImage: {
    width: 250,
    height: 250,
    marginBottom: 30,
  },
  coverMeta: {
    fontSize: 12,
    color: '#f1f1f1',
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#101010',
  },
  sectionHeader: {
    fontSize: 16,
    marginTop: 30,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#101010',
  },
  subsectionHeader: {
    fontSize: 14,
    marginTop: 15,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#303030',
  },
  playerTeamHeader: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#00d3f2',
  },
  opponentTeamHeader: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#c27aff',
  },
  battleHeader: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#101010',
  },
  petItem: {
    fontSize: 12,
    marginLeft: 10,
    marginBottom: 4,
  },
  petList: {
    flexDirection: 'column',
  },
  battleInfo: {
    fontSize: 10,
    marginTop: 5,
    marginBottom: 10,
    fontStyle: 'italic',
    color: '#303030',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    marginVertical: 10,
  },
  tableHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#f1f1f1',
    backgroundColor: '#303030',
    padding: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    alignItems: 'center',
    paddingVertical: 5,
  },
  players: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 5,
  },
  tableCell: {
    fontSize: 11,
    padding: 5,
    flex: 1,
  },
  winText: {
    color: '#016630',
    fontWeight: 'bold',
  },
  lossText: {
    color: '#9f0712',
    fontWeight: 'bold',
  },
  drawText: {
    color: '#894b00',
    fontWeight: 'bold',
  },
});
