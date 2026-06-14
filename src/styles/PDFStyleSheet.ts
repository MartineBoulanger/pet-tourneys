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

export const styles = StyleSheet.create({
  // generic styles
  bottomXS: {
    marginBottom: 2,
  },
  bottomSM: {
    marginBottom: 8,
  },
  bottomBase: {
    marginBottom: 25,
  },
  bottomXL: {
    marginBottom: 40,
  },
  paddingSM: {
    padding: 6,
  },
  bgColor: {
    backgroundColor: '#ffffff',
  },
  textSize10: {
    fontSize: 10,
  },
  textSize11: {
    fontSize: 11,
  },
  textColorGrey: {
    color: '#6b7280',
  },
  fontBold: {
    fontWeight: 'bold',
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  flexRow: {
    flexDirection: 'row',
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: '#f3f4f6',
    marginVertical: 10,
  },
  paragraph: {
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
  },
  // cover page
  coverPage: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  coverImage: {
    width: '100%',
    height: 'auto',
  },
  coverTitle: {
    fontSize: 40,
    textAlign: 'center',
  },
  coverSubtitle: {
    fontSize: 18,
    color: '#1e3a8a',
    textAlign: 'center',
  },
  coverMatchOwner: {
    fontSize: 12,
    color: '#2f3648',
  },
  coverFooter: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // pages
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  pageTitle: {
    fontSize: 26,
  },
  // sections
  sectionTitle: {
    fontSize: 16,
    paddingBottom: 2,
  },
  // tables
  tableHeader: {
    backgroundColor: '#f3f4f6',
    marginTop: 4,
  },
  col1: { width: '35%', fontSize: 9 },
  col2: { width: '15%', fontSize: 9, textAlign: 'center' },
  col3: { width: '15%', fontSize: 9, textAlign: 'center' },
  col4: { width: '15%', fontSize: 9, textAlign: 'center' },
  col5: { width: '20%', fontSize: 9, textAlign: 'center' },
  // the blocks with the dark background
  blockGrid: {
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  viewBlock: {
    backgroundColor: '#111827',
    width: '27%',
    padding: 8,
    borderRadius: 4,
  },
  viewBlockLabel: {
    color: '#e5e7eb',
  },
  viewBlockValue: {
    color: '#f1f1f1',
    fontSize: 30,
  },
  // the rows to make it look like a table but is not a table
  row: {
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: {
    color: '#2f3648',
  },
  value: {
    color: '#111827',
  },
  // matches blocks
  battleHeader: {
    fontSize: 14,
  },
  teamHeader: {
    fontSize: 12,
  },
  players: {
    gap: 60,
  },
  playerTeamHeader: {
    color: '#00d3f2',
  },
  opponentTeamHeader: {
    color: '#c27aff',
  },
  teamList: {
    flexDirection: 'column',
  },
  teamListItem: {
    fontSize: 12,
    marginLeft: 10,
  },
  battleInfo: {
    width: '33%',
    marginTop: 5,
    fontStyle: 'italic',
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
  },
  resultText: {
    fontSize: 12,
    borderRadius: 4,
  },
  winText: {
    backgroundColor: '#dcfce7',
    color: '#016630',
  },
  lossText: {
    backgroundColor: '#ffe2e2',
    color: '#9f0712',
  },
  drawText: {
    backgroundColor: '#fef9c2',
    color: '#894b00',
  },
});
