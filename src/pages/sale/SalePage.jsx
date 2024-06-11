import { useEffect, useRef, useState } from "react";
import { ACCESS_TOKEN, API_URI, IMAGE_URL } from "../../constants";
import axios from "axios";
import { numberFormat } from "../../helpers";
import { toast } from "react-toastify";
import { AddCircleSharp, DoneAllSharp, RemoveCircleSharp, RestoreFromTrashSharp } from "@mui/icons-material";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { NumericFormat } from 'react-number-format';
import { useReactToPrint } from "react-to-print";
import Bill from "./Bill";

export default function SalePage() {
    const [loading, setLoading] = useState(true);
    const [saleLoading, setSaleLoading] = useState(false);
    const [drinks, setDrinks] = useState([])
    const [originalDrinks, setOriginalDrinks] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [searchKeyWord, setSearchKeyWord] = useState();
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [receiveMoney, setReceiveMoney] = useState();
    const [customer, setCustomer] = useState("");

    useEffect(() => {
        fetchDrink();
    }, [])

    useEffect(() => {
        _filter();
    }, [searchKeyWord])

    const fetchDrink = () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        axios.get(API_URI + 'get_drink', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                setLoading(false)
                setDrinks(response?.data?.data);
                setOriginalDrinks(response?.data?.data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    const addToCart = (drinkId) => {
        const _checkIndex = cartItems.findIndex(({ id }) => id === drinkId)
        const drinkIndex = drinks.findIndex(({ id }) => id === drinkId)
        if (cartItems[_checkIndex]?.sale_qty >= cartItems[_checkIndex]?.qty) return toast.error('ຈໍານວນສິນຄ້າຫມົດແລ້ວ!',{theme:'colored'})
        if (_checkIndex >= 0) {
            let _newDrinks = [...cartItems];
            console.log(_newDrinks[_checkIndex]?.sale_qty)
            let qty = _newDrinks[_checkIndex]?.sale_qty + 1;
            _newDrinks[_checkIndex] = { ..._newDrinks[_checkIndex], sale_qty: qty }
            setCartItems(_newDrinks)

            let __newDrinks = [...drinks];
            __newDrinks[drinkIndex] = { ...__newDrinks[drinkIndex], qty: __newDrinks[drinkIndex].qty - 1 }
            setDrinks(__newDrinks)
            return;
        }

        const drinkToAdd = drinks.find((drink) => drink.id === drinkId);
        if (drinkToAdd.qty <= 0) return toast.error('ຈໍານວນສິນຄ້າຫມົດແລ້ວ!',{theme:'colored'})

        let __newDrinks = [...drinks];
        __newDrinks[drinkIndex] = { ...__newDrinks[drinkIndex], qty: __newDrinks[drinkIndex].qty - 1 }
        setDrinks(__newDrinks)

        setCartItems([...cartItems, { ...drinkToAdd, sale_qty: 1 }]);
    };

    const removeFromCart = (drinkId) => {
        const updatedCartItems = cartItems.filter(
            (item) => item.id !== drinkId
        );
        setCartItems(updatedCartItems);

        const _cartData = cartItems.find(({ id }) => id === drinkId)
        const drinkIndex = drinks.findIndex(({ id }) => id === drinkId)
        let __newDrinks = [...drinks];
        __newDrinks[drinkIndex] = { ...__newDrinks[drinkIndex], qty: __newDrinks[drinkIndex].qty + _cartData?.sale_qty }
        setDrinks(__newDrinks)
    };

    const removeQty = (drinkId) => {
        const _checkIndex = cartItems.findIndex(({ id }) => id === drinkId)
        const drinkIndex = drinks.findIndex(({ id }) => id === drinkId)
        if (_checkIndex < 0) return

        let _newDrinks = [...cartItems];
        console.log(_newDrinks[_checkIndex]?.sale_qty)
        let qty = _newDrinks[_checkIndex]?.sale_qty - 1;
        _newDrinks[_checkIndex] = { ..._newDrinks[_checkIndex], sale_qty: qty }
        setCartItems(_newDrinks)

        let __newDrinks = [...drinks];
        __newDrinks[drinkIndex] = { ...__newDrinks[drinkIndex], qty: __newDrinks[drinkIndex].qty + 1 }
        setDrinks(__newDrinks)

        if (_newDrinks[_checkIndex]?.sale_qty < 1) removeFromCart(drinkId)
    }

    const _filter = () => {
        console.log({ searchKeyWord })
        if (searchKeyWord === '' || !searchKeyWord) return setDrinks(originalDrinks)

        const _newDrinks = originalDrinks.filter(drink => { return drink?.name.toUpperCase().includes(searchKeyWord.toUpperCase()) });
        setDrinks(_newDrinks)
    }

    const sumPrice = () => {
        console.log({ cartItems })
        const totalPrice = cartItems.reduce((sumPrice, drink) => sumPrice + (drink?.sale_price * drink?.sale_qty), 0);
        return totalPrice
    }

    const change = () => {
        const _change = parseFloat(receiveMoney ? receiveMoney.toString().replace(/,/g, "") : 0) - parseFloat(sumPrice())
        return _change
    }

    const onSale = async () => {
        if (change() < 0 || saleLoading) return;
        setSaleLoading(true);

        const token = localStorage.getItem(ACCESS_TOKEN);
        const orderitems = cartItems.map(drink => {
            return {
                "d_id": drink?.id,
                "qty": drink?.sale_qty,
                "price": drink?.sale_price,
                "total": drink?.sale_price * drink?.sale_qty,
            }
        })

        const orderData = {
            'receive_name': customer,
            'total': sumPrice(),
            "recieve_money": parseFloat(receiveMoney ? receiveMoney.toString().replace(/,/g, "") : 0),
            "change": change(),
            'items': orderitems
        }

        var config = {
            method: 'post',
            url: API_URI + 'sale_drink',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(orderData)
        };
        await axios(config)
            .then(response => {
                setShowPaymentModal(false);
                toast.success("ຂາຍສໍາເລັດແລ້ວ!", { theme: 'colored' });
                setCartItems([])
                setReceiveMoney()
                handlePrint();
            })
            .catch(error => {
                console.error(error);
            });
        setSaleLoading(false);
    }

    const checkSelectedDrink = (drink) => {
        return cartItems.some(({ id }) => id === drink?.id)
    }

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <div className="sale-container">
            <div className="sale-product-container">
                <Form.Control
                    type="text"
                    name="time"
                    onChange={(e) => setSearchKeyWord(e.target.value)}
                    placeholder="ຄົ້ນຫາຕາມ ຊື່ສິນຄ້າ ຫຼື ປະເພດ"
                />
                {loading && <div className="text-center mt-3"><Spinner /></div>}
                <div className="sale-product-card">
                    {
                        drinks.length > 0 && drinks.map((drink) => {
                            return (
                                <div key={drink} style={{
                                    width: '12.88vw',
                                    height: '14vw',
                                    backgroundColor: '#FFF',
                                    margin: 2,
                                    border: '1px solid #ccc',
                                    borderRadius: "10px",
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                    overflow: "hidden",
                                    cursor: 'pointer'
                                }} onClick={() => addToCart(drink?.id)}>
                                    <div style={{
                                        position: 'relative',
                                        display: 'inline-block'
                                    }}>
                                        <img style={{ width: '13vw', display: 'block', height: 140, position: 'relative', objectFit: 'cover' }} src={IMAGE_URL + drink?.image} alt="" />
                                        {checkSelectedDrink(drink) && <p style={{
                                            position: 'absolute',
                                            top: 20,
                                            right: -23,
                                            transform: 'translate(-50%, -50%)',
                                            backgroundColor: "green",
                                            padding: "8px",
                                            color: "#fff",
                                            borderRadius: 5,
                                            width: 50,
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}><DoneAllSharp style={{ color: 'white' }} /> </p>}
                                        <p style={{
                                            position: 'absolute',
                                            top: 20,
                                            left: 24,
                                            transform: 'translate(-50%, -50%)',
                                            backgroundColor: "grey",
                                            padding: "8px",
                                            color: "#fff",
                                            borderRadius: 5,
                                            width: 50,
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}>{drink?.qty}</p>
                                    </div>
                                    <div style={{ padding: 5, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                        <h3 style={{ fontSize: 18, marginBottom: 5 }}>{drink?.name}</h3>
                                        <p style={{ fontSize: 15, color: "#616161" }}>{numberFormat(drink?.sale_price) + ' ກີບ'}</p>
                                    </div>
                                </div>)
                        })
                    }
                </div>
            </div>
            <div>
                <h3 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 10 }}>ກະຕ່າສິນຄ້າ</h3>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '91vh' }}>
                    <div className="cart-container">
                        {cartItems.map((item) => (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <h5>{item?.name}</h5>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex' }}>
                                        <div>{numberFormat(item?.sale_price)} </div>
                                        <RemoveCircleSharp onClick={() => removeQty(item?.id)} style={{ cursor: 'pointer', color: 'red' }} className="mr-2 ml-2" />
                                        <div>{numberFormat(item?.sale_qty)}</div>
                                        <AddCircleSharp onClick={() => addToCart(item?.id)} style={{ cursor: 'pointer', color: 'green' }} className="mr-2 ml-2" />
                                        <div>{numberFormat(item?.sale_qty * item?.sale_price)}</div>
                                    </div>
                                    <RestoreFromTrashSharp style={{ color: "red", fontSize: 30, cursor: 'pointer' }} onClick={() => removeFromCart(item?.id)} />
                                </div>
                                <hr style={{ margin: "5px 0px" }} />
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'rgb(221, 218, 218)' }}>
                        <div style={{ display: 'flex', marginBottom: 5 }}>
                            <h2>ລາຄາລວມ: </h2>
                            <h2 style={{ color: 'green', marginLeft: 5 }}>{numberFormat(sumPrice())} ກີບ</h2>
                        </div>
                        <Button className="text-center mb-2" style={{ width: 200, height: 45 }} onClick={() => {
                            if (cartItems?.length <= 0) return toast.warning('ກະລຸນາເລືອກສິນຄ້າເຂົ້າກະຕ່າກ່ອນ');
                            setShowPaymentModal(true);
                        }}><h4>ຊໍາລະເງິນ</h4></Button>
                    </div>
                </div>
            </div>
            <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
                <Modal.Header style={{ backgroundColor: "green", }} >
                    <Modal.Title style={{ color: 'white' }}>ຊໍາລະເງິນ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>ລູກຄ້າ:</Form.Label>
                        <Form.Control
                            style={{ marginBottom: 10 }}
                            type="text"
                            name="customer"
                            placeholder="ຊື່ລູກຄ້າ"
                            value={customer}
                            onChange={(e) => setCustomer(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>ຈໍານວນເງິນທັງໝົດທີ່ຕ້ອງຈ່າຍ:</Form.Label>
                        <Form.Control
                            style={{ marginBottom: 10 }}
                            type="text"
                            name="sum_price"
                            value={numberFormat(sumPrice())}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>ຮັບຈໍານວນເງິນ:</Form.Label>
                        <NumericFormat
                            style={{ marginBottom: 10 }}
                            className="form-control"
                            name="receive_money"
                            onChange={(e) => setReceiveMoney(e.target.value)}
                            value={receiveMoney}
                            placeholder="0"
                            thousandSeparator={true}
                        />
                    </Form.Group>
                    <h3>ເງິນທອນ: {numberFormat(change())} ກີບ</h3>
                    {change() < 0 && <div style={{ color: 'red' }}>ກະລຸນາປ້ອນຈໍານວນເງິນໃຫ້ຫລາຍກວ່າ ຫລື ເທົ່າກັບຈໍານວນເງິນທີ່ຕ້ອງຈ່າຍ</div>}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShowPaymentModal(false)}
                        style={{ background: "red", width: "105px", height: "45px", border: 'none', borderRadius: "5px" }}>

                        ຍົກເລີກ</Button>

                    <Button onClick={onSale}
                        style={{ width: "105px", height: "45px", borderRadius: "5px", whiteSpace: 'nowrap', alignItems: 'center', marginLeft: 10 }}>{saleLoading ? <Spinner /> : "ຕົກລົງ"}
                    </Button>
                </Modal.Footer>
            </Modal>
            <div style={{ display: 'none' }}>
                <Bill ref={componentRef} billData={cartItems} customer={customer} sumPrice={sumPrice()} change={change()} receiveMoney={receiveMoney} />
            </div>
        </div >
    )
}