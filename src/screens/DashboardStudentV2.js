import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GradientContainer from '../components/GradientContainer';

// Component to handle image loading with fallback
const SubjectImage = ({ subjectName, primaryImage, fallbackImage, style }) => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        console.log(`Error loading image for ${subjectName}, using fallback`);
        setImageError(true);
    };

    return (
        <Image
            source={imageError ? fallbackImage : primaryImage}
            style={style}
            resizeMode="contain"
            onError={handleImageError}
        />
    );
};

const DashboardStudentV2 = ({
    navigation,
    subjectData = [],
    profileImage,
    name = 'Student',
    greeting = 'Hi',
    searchQuery = '',
    setSearchQuery
}) => {
    const getSubjectImage = (subjectName) => {
        const name = subjectName.toLowerCase();

        if (name.includes('math')) return require('../images/subjects/maths.png');
        if (name.includes('english')) return require('../images/subjects/english.png');
        if (name.includes('science') || name.includes('physics') || name.includes('chemistry') || name.includes('biology')) return require('../images/subjects/science.png');
        if (name.includes('hindi')) return require('../images/subjects/hindi.png');
        if (name.includes('geography') || name.includes('gography')) return require('../images/subjects/gography.png');
        if (name.includes('history')) return require('../images/subjects/history.png');
        if (name.includes('computer') || name.includes('it')) return require('../images/book_icon.png');

        // Default fallback
        return require('../images/subjects/maths.png');
    };

    // Use API data if available, otherwise fallback to default subjects
    const subjects = subjectData.length > 0
        ? subjectData.map((subject) => {
            console.log('API Subject name:', subject.name);
            const image = getSubjectImage(subject.name);
            console.log('Selected image:', image);
            return {
                ...subject,
                image: image,
            };
        })
        : [
            { name: 'Maths', image: require('../images/subjects/maths.png') },
            { name: 'English', image: require('../images/subjects/english.png') },
            { name: 'Science', image: require('../images/subjects/science.png') },
            { name: 'Hindi', image: require('../images/subjects/hindi.png') },
            { name: 'Geography', image: require('../images/subjects/gography.png') },
            { name: 'History', image: require('../images/subjects/history.png') },
        ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1ABC9C" />
            <GradientContainer colors={['#242E3D', '#1ABC9C']} style={styles.header}>
                {/* Header Section */}
                <View style={styles.headerContent}>
                    <View style={styles.greetingSection}>
                        <Text style={styles.greeting}>{greeting}, {name}</Text>
                        <Text style={styles.subGreeting}>Let's start learning</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.profileIcon}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        {profileImage ? (
                            <Image
                                source={{ uri: profileImage }}
                                style={styles.profileImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <Icon name="account-circle" size={32} color="#FFF" />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by subject name"
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            onPress={() => setSearchQuery('')}
                            style={styles.clearButton}
                        >
                            <Icon name="clear" size={20} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>
            </GradientContainer>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                {/* Explore Subject Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Explore Subject</Text>
                    <View style={styles.subjectsGrid}>
                        {subjects
                            .filter(subject =>
                                subject.name.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((subject, index) => (
                                <TouchableOpacity
                                    key={subject.id || index}
                                    style={styles.subjectCard}
                                    onPress={() => {
                                        navigation.navigate('English', { id: subject.id, name: subject.name });
                                    }}
                                >
                                    <Image
                                        source={subject.image}
                                        style={styles.subjectImage}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            ))}
                    </View>
                </View>

                {/* Your Active Plan Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your Active Plan</Text>
                    <TouchableOpacity style={styles.planCard}>
                        <View style={styles.planContent}>
                            <View style={styles.planInfo}>
                                <Text style={styles.planTitle}>Content View</Text>
                                <Text style={styles.planSubtitle}>1 Month Period</Text>
                            </View>
                            <View style={styles.planIcon}>
                                <Image
                                    source={require('../images/plan_image.png')}
                                    style={styles.planImage}
                                    resizeMode="contain"
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 25,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 18,
        marginTop: 5,
    },
    greetingSection: {
        flex: 1,
    },
    greeting: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 2,
    },
    subGreeting: {
        fontSize: 13,
        color: '#E8F8F5',
        opacity: 0.9,
    },
    profileIcon: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },
    profileImage: {
        width: 42,
        height: 42,
        borderRadius: 21,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginTop: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        paddingVertical: 0,
    },
    clearButton: {
        padding: 5,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    contentContainer: {
        paddingBottom: 30,
    },
    section: {
        marginTop: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 15,
    },
    subjectsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    subjectCard: {
        width: '47%',
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    subjectImage: {
        width: 140,
        height: 100,
    },
    planCard: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    planContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    planInfo: {
        flex: 1,
    },
    planTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 4,
    },
    planSubtitle: {
        fontSize: 12,
        color: '#7F8C8D',
    },
    planIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E8F8F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    planImage: {
        width: 24,
        height: 24,
    },
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#E8E8E8',
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
    },
    navText: {
        fontSize: 12,
        marginTop: 4,
        color: '#999',
    },
});

export default DashboardStudentV2;