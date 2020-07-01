import React, {Component, Suspense} from "react";
import {Row,Col, Card, Typography, Button,Input, Alert, Collapse, Steps, List} from 'antd';
import { UserOutlined, SolutionOutlined, LoadingOutlined, SmileOutlined } from '@ant-design/icons';
import './_OrderProfile.scss'
import moment from "../../pages/AdminLayout/AdminLayout";
// A great library for fuzzy filtering/sorting items
const { Meta } = Card;
const { Title } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;
const { Step } = Steps;

class OrderProfile extends Component {
	state = {
		preparedInput: [],
		preparedMovieId: [],
		disableConfirmPrepareButton: true,
		problemDescription: "",
		problemTitle: ""
	};


	componentDidMount() {
		this.setInputData();
	}


	onChange = ({ target: { value } }) => {
		this.setState({ problemDescription: value });
	};

	onChangeTitle = ({ target: { value } }) => {
		this.setState({ problemTitle: value });
	};

	handleChange(idx,event) {
		let value = event.target.value;
		this.setState ((prevState) =>{
			prevState.preparedInput[idx] = value;
			let disabled = false;
			for(let i = 0; i < prevState.preparedInput.length; i++){
				if(isNaN(parseInt(prevState.preparedInput[i]))){
					disabled = true || disabled;
				}else{
					if(parseInt(this.state.preparedInput[i]) > this.props.orderMovies[i]['quantity']){
						disabled = true || disabled;
					}
					if(this.state.preparedInput[i] === ""){
						disabled = true || disabled;
					}
				}
			}
			prevState.disableConfirmPrepareButton = disabled;
			return prevState;
		});
	}

	preparedCopies = (i) => {
		if(this.props.order['orderStatus'] !== 1){
			return(
				 <Meta title={"Copias preparadas"} description={this.props.orderMovies[i]['preparedQuantity']} />
			);
		}
		let showAlert = false;
		let alertMessage = "Número de copias incorrecto";
		if(this.state.preparedInput[i]){
			if(!isNaN(parseInt(this.state.preparedInput[i])+1)){
				if(parseInt(this.state.preparedInput[i]) > this.props.orderMovies[i]['quantity']){
					showAlert = true;
				}
			}else{
				showAlert = true;
				alertMessage = "No ingresó un número";
			}
		}
		return (
			 <div>
				 <Input placeholder={"Copias preparadas "} value={this.state.preparedInput[i] || ''} onChange={(e)=>this.handleChange(i,e)}/>
				 {showAlert ? <Alert message={alertMessage} type="error" /> : null}
			 </div>
		);
	};

	OrderDescription = () => {
		return (
			 <Row className={"descriptionRow"}>
				 <Col>
					 <p>Fecha</p>

				 </Col>
			 </Row>
		)
	};


	CustomCard = (i) => {
		return (
			 <Row justify={"start"}>
				 <Col span={10}>
					 <img className={"movieCardImage"} alt="Image movie" src={this.props.orderMovies[i]['image']} />
				 </Col>
				 <Col span={10}>
					<Row>
						{"Blue-Ray "+this.props.orderMovies[i]['name']}
					</Row>
					 <Row>
						 {"Copias Pedidas: "+this.props.orderMovies[i]['quantity']}
					 </Row>
					 <br/>
					 {this.preparedCopies(i)}
				 </Col>
			 </Row>
		)
	};

	MovieCards = () => {
		let cards = [];
		for(let i = 0; i < this.props.orderMovies.length;i++) {
			cards.push(
				 this.CustomCard(i)
			);
			cards.push(<br/>);
			cards.push(<br/>);
		}
		return cards;
	};

	setInputData() {
		let me = this;
		this.setState ((prevState) =>{
			let inputs = [];
			for(let i = 0; i < this.props.orderMovies.length; i++) {
				inputs.push("");
			}
			prevState.preparedInput = inputs;
			return prevState;
		});
	}

	OrderStatus = () => {
		let loadingIcon = <LoadingOutlined />;
		let currentOrderStatus = this.props.order['orderStatus']-1;
		return (
			 <Steps direction="vertical" size="small" current={this.props.order['orderStatus']-1}>
				 <Step
					  title="Pagado"
					  description={this.props.order['paidOrderDate']}
				 />
				 <Step
					  title="Preparado"
					  description={this.props.order['preparedOrderDate']}
					  icon={currentOrderStatus === 0 ? loadingIcon : null}
				 />
				 <Step
					  title="Despachado"
					  description={this.props.order['dispatchedOrderDate']}
					  icon={currentOrderStatus === 1? loadingIcon : null}
				 />
				 <Step
					  title="Entregado"
					  description={this.props.order['deliveredOrderDate']}
					  icon={currentOrderStatus === 2 ? loadingIcon : null}
				 />
			 </Steps>
		);
	};

	OrderProblems = () => {
		return (
			 <List
				  itemLayout="horizontal"
				  dataSource={this.props.orderProblems}
				  renderItem={item => (
					   <List.Item>
						   <List.Item.Meta
								title={item.title+ ' - ' +item['date']}
								description={item.problemDescription}
						   />
					   </List.Item>
				  )}
			 />
		);
	};

	NewProblemForm = () => {
		return (
			 <Row>
				 <TextArea
					  placeholder="Título"
					  autoSize
					  value={this.state.problemTitle}
					  onChange={this.onChangeTitle}
				 />
				 <br/>
				 <TextArea
					  value={this.state.problemDescription}
					  onChange={this.onChange}
					  placeholder="Descripción"
					  autoSize={{ minRows: 3, maxRows: 5 }}
				 />
				 <Button
					  type={'danger'}
					  block
					  onClick={() => this.props.createProblem(
					  	 this.state.problemTitle,
						   this.state.problemDescription,
						   this.props.order['orderStatus'],
						   this.props.order['orderId']
					  )}
				 >Reportar Problema</Button>
			 </Row>
		)
	};

	nextStatusButton = () => {
		if(this.props.nextStatusMessage === "") return null;
		let finalDisabled = false;
		if(this.props.order['orderStatus'] === 1){
			finalDisabled = this.state.disableConfirmPrepareButton;
		}
		return (
			 <Button
				  type="primary"
				  size={'large'}
				  block
				  disabled={finalDisabled}
				  onClick={
					  () => {
						  if(this.props.order['orderStatus'] === 1) {
						  	    let preparedCopies = [];
							  for(let i = 0; i < this.props.orderMovies.length;i++) {
								  preparedCopies.push(
								  	 {
									     movieId: this.props.orderMovies[i]['movieId'],
									     preparedQuantity: this.state.preparedInput[i]
								     }
								     );
							  }
							  this.props.updatePreparedCopies(this.props.order['orderId'],preparedCopies);
						  }
					  	this.props.updateStatus(this.props.order['orderId'], this.props.order['orderStatus'] + 1)
					  }
				  }
			 >
				 {this.props.nextStatusMessage}
			 </Button>
		);
	};

	render() {
		let orderStatusMap = "";
		switch (this.props.order['orderStatus']) {
			case 1:
				orderStatusMap = "Pedido Pagado";
				break;
			case 2:
				orderStatusMap = "Pedido Preparado";
				break;
			case 3:
				orderStatusMap = "Pedido Despachado";
				break;
			case 4:
				orderStatusMap = "Pedido Entregado";
				break;
		}
		return (
			 <Row className={"orderProfileCtn"}>
				 <Col span={24}>
					 <Row className={"pedidoCtn"} justify="flex-start">
						 <Col span={6}>
							 <Title level={2}>{"Pedido "+this.props.order['orderId']}</Title>
						 </Col>
					 </Row>
					 <Row className={"moviesCtn"} justify="start">
						 <Col span={12}>
							 <Title level={2}>Películas</Title>
							 <Row className={"movieCardsRowCtn"} justify="start">
								 <Col className={"movieCardsCtn"} span={22}>
									 {this.MovieCards()}
								 </Col>
							 </Row>
						 </Col>
						 <Col span={12}>
							 <Title level={2}>Estado</Title>
							 {this.OrderStatus()}
							 <Title level={2}>Problemas</Title>
							 {this.OrderProblems()}
							 <Title level={4}>Agregar Problema</Title>
							 {this.NewProblemForm()}
						 </Col>
					 </Row>
					 <br/>
					 <br/>
					 <Row justify="space-around">
						 <Col>
							 <Button type="dashed" size={'large'} block onClick={this.props.goBack}>
								 Atrás
							 </Button>
						 </Col>
						 <Col>
							 {this.nextStatusButton()}
						 </Col>
					 </Row>

				 </Col>

			 </Row>
		)
	}
}
export default OrderProfile
