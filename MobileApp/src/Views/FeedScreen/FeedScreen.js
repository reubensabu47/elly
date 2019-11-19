import * as React from 'react';
import {View, StyleSheet, Text} from 'react-native'
import { Avatar, Card, Title, Paragraph, Divider } from 'react-native-paper';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import database from '@react-native-firebase/database';
import {NavigationEvents} from 'react-navigation';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import ActivityIndicator from '../../components/ActivityIndicator/ActivityIndicator'
class FeedScreen extends React.Component{

    static navigationOptions = ({navigation})=>{
        return {
            headerTitle: 'Elly',
            headerStyle: {
              backgroundColor: '#4b8b3b',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
            fontWeight: 'bold',
            },
        }
    }

    constructor(props){
        super(props)
        this.state={
            observations: [],
            activityIndicator: true
        }
    }

    componentDidMount(){
          
        database().ref('/users/').on("value", snapshot=>{
            this.getObservations()
        })
    }

    getObservations = async function (){
        const ref = database().ref('/users/');
        
        // Fetch the data snapshot
        const snapshot = await ref.once('value');

        const val = snapshot.val()

        let observations = []

        for(let i in val){
            let name = val[i].name
            let photo = val[i].photo
            //console.log(name)
            //console.log(photo)
            let userNick = val[i].name.toLowerCase().replace(/ /g, '')
            let obs = val[i].observations
            console.log(obs)
            if(obs!==undefined){
                for(let j in obs){
                    //console.log(obs[j])
                    let photUrl = obs[j].photoURL
                    let location = obs[j].location
                    let time = new Date(obs[j].time)
                    observations.push([name, photo, photUrl, location, time, userNick])
                }
            }
            
        }
        await this.setState({
            observations: observations,
            activityIndicator: false
        })
    }

    render() {
        
        return (
            
            <View style={styles.container}>
                <View style={{width: "100%", backgroundColor: 'grey'}}>
                {/* <NavigationEvents onDidFocus={() => this.render()} /> */}
                    <ActivityIndicator title={"Loading"} showIndicator={this.state.activityIndicator}/>
                </View>
                <ScrollView style={{width: "100%"}}>
                    {this.state.observations.map((val,i)=>{
                        console.log(val[4])
                        return (
                            <View style={{marginTop: 5}} key={i}>
                                <Card >
                                    <Card.Title 
                                        title={val[0]} subtitle={"@"+val[5]} 
                                        left={(props) => <Avatar.Image size={50} source={{ uri: val[1] }} />}
                                        right={(props) => <Avatar.Icon style={{backgroundColor: 'white'}} size={50} color='black' icon="dots-vertical" />}
                                    />
                                   
                                    <Card.Cover style={{borderRadius: 5, margin: 10, height: 300}} source={{ uri: val[2] }} />
                                    <Card.Content>
                                        <View style={{flexDirection: 'row',flexWrap: 'wrap', alignItems: 'center'}}>
                                            <Avatar.Icon size={25} color='white' icon="clock" />
                                            <Text> {val[4].toString()}</Text>
                                        </View>
                                        <View >
                                            <TouchableOpacity
                                                style={{marginTop: 5, flexDirection: 'row',flexWrap: 'wrap', alignItems: 'center'}}
                                            >
                                                <Avatar.Icon size={25} color='white' icon="map-marker" />
                                                <Text> {val[3].toString()}</Text>
                                            </TouchableOpacity>
                                            
                                        </View>
                                            
                                    </Card.Content>
                                    <Card.Actions>
                                    </Card.Actions>
                                </Card>
                            </View>
                        )
                    })}
                   
                </ScrollView>
                
            </View>
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    welcome: {
        fontSize: 25
    }
})
export default FeedScreen;

