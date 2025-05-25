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
  // cover page
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
    color: '#8ec5ff',
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  coverImage: {
    width: 250,
    height: 250,
    marginBottom: 40,
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
  // page
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
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    marginVertical: 10,
  },
  // tables
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
  tableCell: {
    fontSize: 11,
    padding: 5,
    flex: 1,
  },
  // blocks
  blocksGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  overviewBlock: {
    backgroundColor: '#303030',
    width: '49%',
    padding: 15,
    borderRadius: 8,
  },
  overviewBlockTitle: {
    color: '#f1f1f1',
    fontWeight: 'bold',
  },
  overviewBlockValue: {
    color: '#8ec5ff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  overviewBlockValueList: {
    color: '#8ec5ff',
    fontStyle: 'italic',
    fontSize: 12,
    marginTop: 5,
  },
  // others
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
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#f1f1f1',
  },
  petItem: {
    color: '#f1f1f1',
    fontSize: 12,
    marginLeft: 10,
    marginBottom: 4,
  },
  petList: {
    flexDirection: 'column',
  },
  battleInfo: {
    width: '40%',
    fontSize: 10,
    marginTop: 5,
    fontStyle: 'italic',
    padding: 5,
    borderRadius: 4,
    backgroundColor: '#cccccc',
    color: '#101010',
  },
  players: {
    flexDirection: 'row',
    gap: 60,
    padding: 5,
  },
  winText: {
    backgroundColor: '#dcfce7',
    color: '#016630',
    padding: 5,
    fontSize: 12,
    borderRadius: 4,
  },
  lossText: {
    backgroundColor: '#ffe2e2',
    color: '#9f0712',
    padding: 5,
    fontSize: 12,
    borderRadius: 4,
  },
  drawText: {
    backgroundColor: '#fef9c2',
    color: '#894b00',
    padding: 5,
    fontSize: 12,
    borderRadius: 4,
  },
});
