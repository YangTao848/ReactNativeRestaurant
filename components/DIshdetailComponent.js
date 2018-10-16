import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, Button, Modal } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreators';
import { Rating, Input } from 'react-native-elements';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites,
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId))
})

function RenderDish(props) {
    const dish = props.dish;
    if (dish != null) {
        return (
            <Card
                featuredTitle={dish.name}
                image={{ uri: baseUrl + dish.image }}
            >
                <Text style={{ margin: 10 }}>
                    {dish.description}
                </Text>
                <View
                    style={styles.formRow}
                >
                    <Icon
                        raised
                        reverse
                        name={props.favorite ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='#f50'
                        onPress={() => { props.favorite ? console.log('Already favorite') : props.onPress() }}
                    />
                    <Icon
                        raised
                        reverse
                        name='pencil'
                        type='font-awesome'
                        color='#512DA8'
                        onPress={props.toggleModal}
                    />
                </View>
            </Card>);
    } else {
        return (<View></View>);
    }
}

function RenderComments(props) {
    const comments = props.comments;

    const renderCommentItem = ({ item, index }) => {
        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>
                    {item.comment}
                </Text>
                <Text style={{ fontSize: 12 }}>
                    {item.rating} Stars
                </Text>
                <Text style={{ fontSize: 12 }}>
                    {'-- ' + item.author + ', ' + item.date}
                </Text>
            </View>
        );
    }

    return (
        <Card title='Comments'>
            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
            />
        </Card>
    );

}

class Dishdetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rating: 1,
            author: '',
            comment: '',
            showModal: false,
        }
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    static navigationOptions = {
        title: 'Dish Details'
    }

    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }

    handleComment() {
        console.log(JSON.stringify(this.state));
        this.toggleModal();
    }

    resetForm() {
        this.setState({
            rating: 1,
            author: '',
            comment: '',
            showModal: false
        });
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId', '');

        return (
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    toggleModal={() => this.toggleModal()}
                />
                <RenderComments comments={this.props.comments.comments.filter((comment => comment.dishId === dishId))} />
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={() => this.toggleModal()}
                >
                    <View style={styles.modal}>
                        <Rating
                            showRating
                            type="star"
                            fractions={1}
                            startingValue={this.state.rating}
                            imageSize={40}
                            onFinishRating={(rating) => this.setState({ rating: rating })}
                        />
                        <View style={{
                            marginBottom: 20,
                        }}>
                            <Input
                                placeholder='Author'
                                leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                            />
                            <Input
                                placeholder='Comment'
                                leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                            />
                        </View>
                        <View style={{
                            fontWeight: 'bold',
                            backgroundColor: '#512DA8',
                            marginBottom: 20,
                        }}>
                            <Button
                                onPress={() => { this.toggleModal(); this.resetForm(); }}
                                color="white"
                                title="SUBMIT"
                            />
                        </View>
                        <View style={{
                            fontWeight: 'bold',
                            backgroundColor: 'grey',
                            marginBottom: 20,
                        }}>
                            <Button
                                onPress={() => { this.toggleModal(); this.resetForm(); }}
                                color="white"
                                title="CANCEL"
                            />
                        </View>
                    </View>
                </Modal>
            </ScrollView >
        );
    }
}

styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20,
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);