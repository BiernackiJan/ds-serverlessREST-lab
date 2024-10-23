import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const deleteMovie: APIGatewayProxyHandler = async (event) => {
    const movieID = event.pathParameters?.movieID;

    if (!movieID) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'MovieID is required' }),
        };
    }

    const params = {
        TableName: 'Movies',
        Key: {
            movieID: movieID,
        },
    };

    try {
        await ddbDocClient.send(new DeleteCommand(params));
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Movie deleted successfully' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to delete movie', error: error.message }),
        };
    }
};