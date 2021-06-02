const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");

//specify assertation style
chai.should();

//enable to call our RESTful API
chai.use(chaiHttp);

describe("GET ALL /api/task", function () {
  it("should GET all the tasks", function (done) {
    chai
      .request(server)
      .get("/api/tasks")
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a("array");
        response.body.length.should.be.eq(3);
      });
    done();
  });

  it("should NOT GET all the tasks", function (done) {
    chai
      .request(server)
      .get("/api/task")
      .end((err, response) => {
        response.should.have.status(404);
      });
    done();
  });
});

describe("GET task by ID", () => {
  it("should GET a task by ID", (done) => {
    const taskId = 1;
    chai
      .request(server)
      .get("/api/tasks/" + taskId)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body.should.have.property("id");
        response.body.should.have.property("name");
        response.body.should.have.property("completed");
        response.body.should.have.property("id").eq(1);
      });
    done();
  });
  it("should NOT GET a task by ID", (done) => {
    const taskId = 123;
    chai
      .request(server)
      .get("/api/tasks/" + taskId)
      .end((err, response) => {
        response.should.have.status(404);
        response.text.should.be.eq(
          "The task with the provided ID does not exist."
        );
      });
    done();
  });
});

describe("POST /api/tasks", () => {
  it("should POST a new task", (done) => {
    const task = {
      name: "Task 4",
      completed: false,
    };

    chai
      .request(server)
      .post("/api/tasks")
      .send(task)
      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.be.a("object");
        response.body.should.have.property("id").eq(4);
        response.body.should.have.property("name").eq("Task 4");
        response.body.should.have.property("completed").eq(false);
      });
    done();
  });

  it("should NOT POST a new task without the name property", (done) => {
    const task = {
      name: "",
      completed: false,
    };

    chai
      .request(server)
      .post("/api/tasks")
      .send(task)
      .end((err, response) => {
        response.should.have.status(400);
        response.text.should.be.eq(
          "The name should be at least 3 characters long"
        );
      });
    done();
  });
});

describe("PUT /api/tasks/:id", () => {
  it("should PUT an existing task", (done) => {
    const taskId = 1;
    const task = {
      name: "Task 1 changed",
      completed: true,
    };
    chai
      .request(server)
      .put("/api/tasks/" + taskId)
      .send(task)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body.should.have.property("id").eq(1);
        response.body.should.have.property("name").eq("Task 1 changed");
        response.body.should.have.property("completed").eq(true);
      });
    done();
  });

  it("should NOT PUT an existing task with a name that is less than 3 characters", (done) => {
    const taskId = 1;
    const task = {
      name: "Ta",
      completed: true,
    };
    chai
      .request(server)
      .put("/api/tasks/" + taskId)
      .send(task)
      .end((err, response) => {
        response.should.have.status(400);
        response.text.should.be.eq(
          "The name should be at least 3 characters long"
        );
      });
    done();
  });
});

describe("PATCH /api/tasks/:id", () => {
  it("should PATCH an existing task", (done) => {
    const taskId = 1;
    const task = {
      name: "Task 1 patch",
    };
    chai
      .request(server)
      .patch("/api/tasks/" + taskId)
      .send(task)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body.should.have.property("id").eq(1);
        response.body.should.have.property("name").eq("Task 1 patch");
      });
    done();
  });

  it("should NOT PATCH an existing task with a name that is less than 3 characters", (done) => {
    const taskId = 1;
    const task = {
      name: "T",
    };
    chai
      .request(server)
      .patch("/api/tasks/" + taskId)
      .send(task)
      .end((err, response) => {
        response.should.have.status(400);
        response.text.should.be.eq(
          "The name should be at least 3 characters long"
        );
      });
    done();
  });
});

describe("DELETE /api/tasks/:id", () => {
  it("should DELETE an existing task", (done) => {
    const taskId = 1;
    chai
      .request(server)
      .delete("/api/tasks/" + taskId)
      .end((err, response) => {
        response.should.have.status(200);
        done();
      });
  });

  it("should NOT DELETE a task that is not in the database", (done) => {
    const taskId = 654;
    chai
      .request(server)
      .delete("/api/tasks/" + taskId)
      .end((err, response) => {
        response.should.have.status(404);
        response.text.should.be.eq(
          "The task with the provided ID does not exist."
        );
        done();
      });
  });
});
