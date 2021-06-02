const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");

chai.should();

chai.use(chaiHttp);

describe("GET ALL /api.task", () => {
  it("should GET all the tasks", (done) => {
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

  it("should NOT GET all the tasks", (done) => {
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
        response.text.should.be.eq("Not Exist");
      });
    done();
  });
});
