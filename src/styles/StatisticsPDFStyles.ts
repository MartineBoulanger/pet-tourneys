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
  // generic page styles
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 25,
  },
  // section styles
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  // Table like rows but not for the tables
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  label: {
    fontSize: 11,
    color: '#2f3648',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 10,
    color: '#111827',
  },
  // info text
  paragraph: {
    fontSize: 10,
    marginBottom: 25,
    borderRadius: 4,
    padding: 6,
    backgroundColor: '#e5e7eb',
  },
  // table styling
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 6,
    marginTop: 4,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  col1: { width: '35%', fontSize: 9 },
  col2: { width: '15%', fontSize: 9, textAlign: 'center' },
  col3: { width: '15%', fontSize: 9, textAlign: 'center' },
  col4: { width: '15%', fontSize: 9, textAlign: 'center' },
  col5: { width: '20%', fontSize: 9, textAlign: 'center' },
  colHeader: { fontWeight: 'bold', fontSize: 10 },
  // boxes with some stats in
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  statBox: {
    width: '27%',
    backgroundColor: '#111827',
    padding: 8,
    borderRadius: 4,
  },
  statBoxLabel: {
    fontSize: 8,
    color: '#e5e7eb',
    marginBottom: 2,
  },
  statBoxValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f1f1f1',
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
    backgroundColor: '#ffffff',
  },
  coverTitle: {
    fontSize: 40,
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  coverSubtitle: {
    fontSize: 18,
    color: '#1e3a8a',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  coverMarginBottom: {
    marginBottom: 40,
  },
  coverMatchOwnerTitle: {
    fontSize: 12,
    color: '#2f3648',
  },
  coverMatchRegionTitle: {
    fontSize: 11,
    color: '#6b7280',
  },
  coverImage: {
    width: '100%',
    height: 'auto',
    marginBottom: 40,
  },
  coverMeta: {
    fontSize: 10,
    color: '#6b7280',
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
