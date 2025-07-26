import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { Container, Form, Button, Card, Row, Col, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore"; // Import Firestore functions

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Fetch posts from Firebase
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          description: doc.data().description,
          date: doc.data().date,
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  // Add a post to Firebase
  const addPost = async () => {
    if (title && description) {
      await addDoc(collection(db, "posts"), {
        title: title,
        description: description,
        date: new Date().toLocaleString(),
      });
      setTitle("");
      setDescription("");
      setShowModal(false); // Close the modal after adding
    }
  };

  return (
    <Container>
      <h1 className="my-4 text-center">Rake - Blog Posts</h1>

      {/* Button to open the modal */}
      <Button className="mb-4" variant="primary" onClick={() => setShowModal(true)}>
        Create Post
      </Button>

      {/* Modal for creating a post */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Post Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Post Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter a description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={addPost}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Displaying posts */}
      <Row className="mt-5">
        {posts.map((post) => (
          <Col key={post.id} md={4}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text>{post.description}</Card.Text>
                <Card.Subtitle className="text-muted">{post.date}</Card.Subtitle>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default App;
