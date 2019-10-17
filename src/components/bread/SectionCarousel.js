import React from "react";
// react component for creating beautiful carousel
import Carousel from "react-slick";
// material-ui components
// @material-ui/icons
import LocationOn from "@material-ui/icons/LocationOn";
// core components
import GridContainer from "../common/GridContainer.jsx";
import GridItem from "../common/GridItem.jsx";
import Card from "../common/Card.jsx";

import "../../styles/scss/material-kit-react.scss";

import * as api from "../common/Api"

class SectionCarousel extends React.Component {
    state= {
        imgs: []
    };
    componentDidMount() {
        this.getBread();
    }
    getBread = () => {
        let response = api.getAllBreads();
        response.then(response => {
            if(response.status===200) {
                console.log('알림창 추가하자');
                this.setState({
                    imgs: response.data.map(bread => ({name: bread.name, url: bread.imageUrl}))
                });
            }
        });
    };
    render() {
        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true
        };
        return (
            <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                    <Card>
                        <Carousel {...settings}>
                            {
                                this.state.imgs.map((img,key) => (
                                    <div key={key}>
                                        <img
                                            src={img}
                                            alt="First slide"
                                            className="slick-image"
                                        />
                                        <div className="slick-caption">
                                            <h4>
                                                <LocationOn className="slick-icons" />{img.name}
                                            </h4>
                                        </div>
                                    </div>
                                ))
                            }
                        </Carousel>
                    </Card>
                </GridItem>
            </GridContainer>
        );
    }
}

export default SectionCarousel;
